import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder'
import { LucidRow, LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { RelationshipsContract, ModelRelations } from '@adonisjs/lucid/types/relations'
import { scope } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import string from '@poppinss/utils/string'

type Query<Model extends LucidModel> =
  | ModelQueryBuilderContract<Model>
  | DatabaseQueryBuilderContract<Model>

type Column = string | number | bigint | boolean | DateTime

type RelationPathPlotter<Key, Value, DuplicateModels> = Key extends string
  ? Value extends Column
    ? Key
    : Value extends ModelRelations<LucidModel, LucidModel>
      ? Value['instance'] extends DuplicateModels
        ? never
        : `${Key}.${RelationPath<Value['instance'], DuplicateModels | Value['instance']>}`
      : never
  : never

type RelationPath<Model extends LucidRow, DuplicateModels = Model> = {
  [Key in keyof Model]: RelationPathPlotter<Key, Model[Key], DuplicateModels>
}[keyof Omit<Model, keyof LucidRow>]

/**
 * Sample Output Query
 * collectors.collections.name generates:
 * subQuery = Database.from('collectors')
 * subquery1 = Database.from('collections').select('collectors.ollector_id').where('name', 'LIKE', `%search%`)
 * subQuery.whereIn('collectors.id', subquery1)
 * subQuery.select('collectors.id')
 * subQuery = Database.from('collector_user').whereIn('collector_id', subQuery).select('user_id')
 * query.whereIn('users.id', subQuery)
 */

const queryNestedRelations = <Model extends LucidModel>(
  query: Query<Model>,
  model: Model,
  sections: string[],
  onSubQuery?: (subQuery: Query<Model>, relatedTable: string) => any,
  onQuery?: (query: Query<Model>) => (column: any, subQuery: Query<Model>) => any
) => {
  if (sections.length < 1) {
    if (onSubQuery) onSubQuery(query, model.table)
    return
  }
  const relation: any = sections[0]
  const next: any = sections[1]
  sections.splice(0, 1)

  const relationship: RelationshipsContract = new model().related(relation).relation

  if (!relationship) throw new Error(`${relation} does not exist on model ${model.name}`)

  const relatedTable = relationship.relatedModel().table
  let subQuery = query.client.from(relatedTable)

  // if a nested relation exists then recursively modify the subquery otherwise run the specified subQuery
  if (next) {
    queryNestedRelations(
      subQuery,
      relationship.relatedModel() as Model,
      sections,
      onSubQuery,
      onQuery
    )
  } else if (onSubQuery) {
    onSubQuery(subQuery, relatedTable)
  }

  let localKey = 'id'

  if (relationship.type === 'belongsTo') {
    subQuery.select(`${relatedTable}.${relationship.localKey}`)
    localKey = relationship['foreignKeyColumnName']
  } else if (relationship.type === 'hasMany' || relationship.type === 'hasOne') {
    subQuery.select(`${relatedTable}.${relationship['foreignKeyColumnName']}`)
    localKey = relationship.localKey
  } else if (relationship.type === 'manyToMany') {
    subQuery.select(`${relatedTable}.${relationship.relatedKey}`)
    subQuery = query.client
      .from(relationship.pivotTable)
      .whereIn(`${relationship.pivotTable}.${relationship.pivotRelatedForeignKey}`, subQuery)
      .select(`${relationship.pivotTable}.${relationship.pivotForeignKey}`)
    localKey = relationship.localKey
  }

  const modelColumn: any = `${model.table}.${localKey}`

  if (onQuery) {
    query[onQuery(query).name](modelColumn, subQuery)
  } else {
    query.whereIn(modelColumn, subQuery)
  }
}

export const search = <
  Model extends LucidModel,
  Columns extends (RelationPath<InstanceType<Model>> | string)[],
  Computed extends Partial<Record<Columns[number], (search: any) => any>>,
>(
  modelOrDefaultColumns1: Columns | Model,
  modelOrDefaultColumns2?: Model | Columns,
  defaultComputed?: Computed,
  options?: { columnsCase?: 'snake' | 'camel'; spliTText?: string }
) =>
  scope(
    (
      query: ModelQueryBuilderContract<LucidModel>,
      searchText: any,
      columns?: (RelationPath<InstanceType<Model>> | string)[],
      computed?: Computed
    ) => {
      const defaultColumns = (
        Array.isArray(modelOrDefaultColumns1) ? modelOrDefaultColumns1 : modelOrDefaultColumns2
      ) as Columns

      query.where((query) => {
        columns = columns || defaultColumns
        const allColumns = Array.from(new Set([...columns, ...defaultColumns]))
        for (const index in allColumns) {
          const column = allColumns[index]
          const computedColumn = computed?.[column] ?? defaultComputed?.[column]

          const computedSearch = computedColumn ? computedColumn(searchText) : searchText
          const spliTText = options?.spliTText ?? '.'
          const sections = column.split(spliTText)
          const searchedColumn =
            options?.columnsCase === 'camel'
              ? sections[sections.length - 1]
              : string.snakeCase(sections[sections.length - 1])

          sections.splice(sections.length - 1, 1)

          queryNestedRelations(
            query,
            query.model,
            sections,
            (subQ, relatedTable) =>
              subQ.orWhereRaw(
                `(CAST(unaccent(${relatedTable}.${searchedColumn}) AS TEXT)) ILIKE ?`,
                [`%${computedSearch}%`]
              ),
            (q) => q.orWhereIn
          )
        }
      })
    }
  )

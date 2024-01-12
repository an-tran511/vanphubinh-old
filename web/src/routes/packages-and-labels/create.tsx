import { Field, Form, FormInstance } from 'houseform';
import {
  SimpleGrid,
  Text,
  Group,
  TextInput,
  Divider,
  NumberInput,
  Stack,
  Grid,
  ComboboxChevron,
  Textarea,
} from '@mantine/core';
import { Create } from '@components/crud/create';
import { FileRoute } from '@tanstack/react-router';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import {
  categoriesQueryOptions,
  partnersQueryOptions,
  uomsQueryOptions,
} from '@apis/query-options';
import { Partner } from '@app-types/partner';
import { CreatableSelect } from '@components/select';
import { Uom } from '@/app-types/uom';
import { NewPackageAndLabel, PackageAndLabel } from '@app-types/package-and-label';
import { createPackageAndLabel } from '@apis/package-and-label';
import { toast } from 'sonner';
import { z } from 'zod';

export const Route = new FileRoute('/packages-and-labels/create').createRoute({
  component: CreateComponent,
});

export function CreateComponent() {
  const formRef = useRef<FormInstance<NewPackageAndLabel>>(null);

  const [searchPartnerDraft, setSearchPartnerDraft] = useState('');
  const [debouncedSearchPartnerDraft] = useDebouncedValue(searchPartnerDraft, 300);

  const [searchUomDraft, setSearchUomDraft] = useState('');
  const [debouncedSearchUomDraft] = useDebouncedValue(searchUomDraft, 300);

  const [searchCatDraft, setSearchCatDraft] = useState('');
  const [debouncedSearchCatDraft] = useDebouncedValue(searchCatDraft, 300);
  const queryClient = useQueryClient();

  //Partners query
  const partnersQuery = useSuspenseQuery(
    partnersQueryOptions({
      deps: { page: 1, searchValue: debouncedSearchPartnerDraft },
      noMeta: true,
    })
  );
  const partners = partnersQuery.data as Partner[];
  const partnerOptions = useMemo(() => {
    return partners
      ? partners.map((item: Partner) => ({
          label: String(item.name),
          value: String(item.id),
        }))
      : [];
  }, [partners]);
  const onSearchPartner = (value: string) => {
    setSearchPartnerDraft(value);
  };
  const partnerSelectLoading = partnersQuery.isFetching;

  //Uoms query
  const uomsQuery = useSuspenseQuery(
    uomsQueryOptions({
      deps: { page: 1, searchValue: debouncedSearchUomDraft },
      noMeta: true,
    })
  );
  const uoms = uomsQuery.data as Uom[];
  const uomOptions = useMemo(() => {
    return uoms
      ? uoms.map((item: Uom) => ({
          label: String(item.name),
          value: String(item.id),
        }))
      : [];
  }, [uoms]);
  const onSearchUom = (value: string) => {
    setSearchUomDraft(value);
  };
  const uomSelectLoading = uomsQuery.isFetching;

  //Cats query
  const catsQuery = useSuspenseQuery(
    categoriesQueryOptions({
      deps: { page: 1, searchValue: debouncedSearchCatDraft },
      noMeta: true,
    })
  );
  const cats = catsQuery.data as Uom[];
  const catOptions = useMemo(() => {
    return cats
      ? cats.map((item: Uom) => ({
          label: String(item.name),
          value: String(item.id),
        }))
      : [];
  }, [cats]);
  const onSearchCat = (value: string) => {
    setSearchCatDraft(value);
  };
  const catSelectLoading = catsQuery.isFetching;

  //Mutation
  const mutation = useMutation({
    mutationFn: (values: NewPackageAndLabel) => createPackageAndLabel(values),
    onSuccess: (data: PackageAndLabel) => {
      queryClient.invalidateQueries({ queryKey: ['packages-and-labels'] });
      toast.success(`${data.name} đã được tạo thành công`);
    },
  });

  const doSubmit = () => {
    formRef?.current?.submit();
  };
  return (
    <Create title="Thêm sản phẩm bao bì" submitHandler={doSubmit}>
      <Form onSubmit={(values: NewPackageAndLabel) => mutation.mutate(values)} ref={formRef}>
        {() => (
          <Stack gap="md" my="md" px="md">
            <Grid>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Group justify="space-between">
                  <Text fw="500" size="md">
                    1. Thông tin sản phẩm
                  </Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 9 }}>
                <Stack>
                  <Field name="name" initialValue={''}>
                    {({ value, setValue, onBlur }) => (
                      <TextInput
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={onBlur}
                        size="sm"
                        label="Tên sản phẩm"
                        required
                        aria-required
                      />
                    )}
                  </Field>
                  <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                    <Field
                      name="uomId"
                      initialValue={''}
                      onChangeValidate={z.string().transform((val) => Number(val))}
                    >
                      {({ value, setValue, onBlur }) => (
                        <CreatableSelect
                          size="sm"
                          required
                          value={value}
                          label="Đơn vị chính"
                          data={uomOptions}
                          onChange={(value) => {
                            setValue(value || '');
                          }}
                          onBlur={onBlur}
                          searchable
                          creatable
                          onSearchChange={onSearchUom}
                          isLoadingOptions={uomSelectLoading}
                          rightSection={<ComboboxChevron />}
                          rightSectionPointerEvents="none"
                        />
                      )}
                    </Field>
                    <Field name="secondaryUomId" initialValue={''}>
                      {({ value, setValue, onBlur }) => (
                        <CreatableSelect
                          size="sm"
                          value={value}
                          label="Đơn vị thứ hai"
                          data={uomOptions}
                          onChange={(value) => {
                            setValue(value || '');
                          }}
                          onBlur={onBlur}
                          searchable
                          creatable
                          onSearchChange={onSearchUom}
                          isLoadingOptions={uomSelectLoading}
                          rightSection={<ComboboxChevron />}
                          rightSectionPointerEvents="none"
                        />
                      )}
                    </Field>
                    <Field name="purchaseUomId" initialValue={''}>
                      {({ value, setValue, onBlur }) => (
                        <CreatableSelect
                          size="sm"
                          value={value}
                          label="Đơn vị mua hàng"
                          data={uomOptions}
                          onChange={(value) => {
                            setValue(value || '');
                          }}
                          onBlur={onBlur}
                          searchable
                          creatable
                          onSearchChange={onSearchUom}
                          isLoadingOptions={uomSelectLoading}
                          rightSection={<ComboboxChevron />}
                          rightSectionPointerEvents="none"
                        />
                      )}
                    </Field>
                  </SimpleGrid>
                  <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                    <Field
                      name="partnerId"
                      initialValue={''}
                      onChangeValidate={z.string().transform((val) => Number(val))}
                    >
                      {({ value, setValue, onBlur }) => (
                        <CreatableSelect
                          size="sm"
                          value={value}
                          label="Khách hàng"
                          data={partnerOptions}
                          onChange={(value) => {
                            setValue(value || '');
                          }}
                          onBlur={onBlur}
                          searchable
                          creatable
                          onSearchChange={onSearchPartner}
                          isLoadingOptions={partnerSelectLoading}
                          rightSection={<ComboboxChevron />}
                          rightSectionPointerEvents="none"
                        />
                      )}
                    </Field>
                    <Field name="categoryId" initialValue={''}>
                      {({ value, setValue, onBlur }) => (
                        <CreatableSelect
                          size="sm"
                          value={value}
                          label="Loại hàng hoá"
                          data={catOptions}
                          onChange={(value) => {
                            setValue(value || '');
                          }}
                          onBlur={onBlur}
                          searchable
                          creatable
                          onSearchChange={onSearchCat}
                          isLoadingOptions={catSelectLoading}
                          rightSection={<ComboboxChevron />}
                          rightSectionPointerEvents="none"
                        />
                      )}
                    </Field>
                    <Field name="itemCode" initialValue={''}>
                      {({ value, setValue, onBlur }) => (
                        <TextInput
                          label="Mã hàng hoá"
                          size="sm"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          onBlur={onBlur}
                        />
                      )}
                    </Field>
                  </SimpleGrid>
                  <Field name="note" initialValue={''}>
                    {({ value, setValue, onBlur }) => (
                      <Textarea
                        label="Ghi chú"
                        size="sm"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={onBlur}
                      />
                    )}
                  </Field>
                </Stack>
              </Grid.Col>
            </Grid>
            <Divider my="xs" />
            <Grid>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Group justify="space-between">
                  <Text fw={500} size="md">
                    2. Thông số kỹ thuật
                  </Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 9 }}>
                <Stack gap="md">
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    <Field name="specs.dimension">
                      {({ value, setValue, onBlur }) => (
                        <TextInput
                          label="Kt  (rộng x cao)"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          onBlur={onBlur}
                          size="sm"
                        />
                      )}
                    </Field>

                    <Field name="specs.seamingDimension" initialValue={''}>
                      {({ value, setValue, onBlur }) => (
                        <TextInput
                          label="Kt dán (rộng x cao)"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          onBlur={onBlur}
                          size="sm"
                        />
                      )}
                    </Field>
                  </SimpleGrid>
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    <Field name="specs.thickness">
                      {({ value, setValue, onBlur }) => (
                        <NumberInput
                          label="Độ dày (micron)"
                          value={value}
                          onChange={(val) => setValue(val)}
                          onBlur={onBlur}
                          size="sm"
                        />
                      )}
                    </Field>
                    <Field name="specs.colorCount">
                      {({ value, setValue, onBlur }) => (
                        <NumberInput
                          label="Số màu"
                          value={value}
                          onChange={(val) => setValue(val)}
                          onBlur={onBlur}
                          size="sm"
                        />
                      )}
                    </Field>
                  </SimpleGrid>
                </Stack>
              </Grid.Col>
            </Grid>
            <Divider my="xs" />
            {/* <Grid>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Group justify="space-between">
                  <Text fw={500} size="md">
                    3. Trục
                  </Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 9 }}>
                <Stack gap="md">
                  <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                    <Field name="name" initialValue="0">
                      {({ value, setValue, onBlur }) => (
                        <NumberInput
                          label="Số cây trục trong bộ"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          onBlur={onBlur}
                          size="sm"
                        />
                      )}
                    </Field>
                    <Field name="name" initialValue={''}>
                      {({ value, setValue, onBlur }) => (
                        <TextInput
                          label="Qui cách trục"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          onBlur={onBlur}
                          size="sm"
                        />
                      )}
                    </Field>
                    <Field name="name" initialValue={''}>
                      {({ value, setValue, onBlur }) => (
                        <TextInput
                          label="Vị trí"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          onBlur={onBlur}
                          size="sm"
                        />
                      )}
                    </Field>
                  </SimpleGrid>
                </Stack>
                <Space h="md" />

                <FieldArray<{ setId: string | null; axes: string | null }> name="sharedAxes">
                  {({ value, add }) => (
                    <>
                      <Group>
                        <Text fw={500} size="sm">
                          Các bộ trục dùng chung
                        </Text>
                        <Button
                          size="compact-xs"
                          variant="outline"
                          onClick={() => add({ setId: '', axes: '' })}
                        >
                          + Thêm bộ trục
                        </Button>
                      </Group>
                      <Table>
                        <Table.Tbody>
                          {value.map((person, i) => (
                            <Table.Tr>
                              <Table.Td w="50%">
                                <FieldArrayItem<string | null>
                                  name={`sharedAxes[${i}].setId`}
                                  key={`person-name-${i}`}
                                >
                                  {({ value, setValue, onBlur }) => {
                                    return (
                                      <CreatableSelect
                                        size="sm"
                                        value={value}
                                        placeholder="Chọn bộ trục"
                                        data={partnerOptions}
                                        onChange={(value) => {
                                          setValue(value || '');
                                        }}
                                        onBlur={onBlur}
                                        searchable
                                        creatable
                                        onSearchChange={onSearchPartner}
                                        isLoadingOptions={partnerSelectLoading}
                                        rightSection={<ComboboxChevron />}
                                        rightSectionPointerEvents="none"
                                      />
                                    );
                                  }}
                                </FieldArrayItem>
                              </Table.Td>
                              <Table.Td w="50%">
                                <FieldArrayItem<string>
                                  name={`sharedAxes[${i}].axes`}
                                  key={`person-age-${i}`}
                                >
                                  {({ value, setValue }) => {
                                    return (
                                      <TextInput
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        placeholder="Các trục dùng chung: trắng, xanh lá"
                                      />
                                    );
                                  }}
                                </FieldArrayItem>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </>
                  )}
                </FieldArray>
              </Grid.Col>
            </Grid> */}
          </Stack>
        )}
      </Form>
    </Create>
  );
}

import {
  categoriesQueryOptions,
  partnersQueryOptions,
  uomsQueryOptions,
} from '@apis/query-options';
import { Uom } from '@app-types/uom';
import { CreatableSelect } from '@components/select';
import { TPackageAndLabelMutation, TPackageAndLabel } from '@app-types/package-and-label';
import {
  Group,
  SimpleGrid,
  Stack,
  TextInput,
  Text,
  Textarea,
  ComboboxChevron,
  Card,
  Tabs,
  Accordion,
  Image,
  Box,
} from '@mantine/core';
import { useDebouncedValue, useFocusTrap } from '@mantine/hooks';
import { Field, Form, FormInstance } from 'houseform';
import { ForwardedRef, forwardRef, useMemo, useState } from 'react';
import { z } from 'zod';
import accClasses from '@components/accordion/Accordion.module.css';
import { Cylinder, Info } from '@phosphor-icons/react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Partner } from '@app-types/partner';
import { UseMutationResult, useSuspenseQuery } from '@tanstack/react-query';
import classes from '@components/inline-edit-input/InlineEditInput.module.css';

interface PackageAndLabelFormProps {
  mutation: UseMutationResult<TPackageAndLabel, Error, TPackageAndLabelMutation, unknown>;
  data?: TPackageAndLabel;
}
export const PackageAndLabelForm = forwardRef(function RefForm(
  props: PackageAndLabelFormProps,
  ref: ForwardedRef<FormInstance<TPackageAndLabelMutation>> | undefined
) {
  const { mutation, data } = props;

  const [searchPartnerDraft, setSearchPartnerDraft] = useState('');
  const [debouncedSearchPartnerDraft] = useDebouncedValue(searchPartnerDraft, 300);

  const [searchUomDraft, setSearchUomDraft] = useState('');
  const [debouncedSearchUomDraft] = useDebouncedValue(searchUomDraft, 300);

  const [searchCatDraft, setSearchCatDraft] = useState('');
  const [debouncedSearchCatDraft] = useDebouncedValue(searchCatDraft, 300);
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
  const focusTrapRef = useFocusTrap();

  // const mutation = useMutation({
  //   mutationFn: (values: TPackageAndLabelMutation) => createTPackageAndLabel(values),
  //   onSuccess: (data: TPackageAndLabel) => {
  //     queryClient.invalidateQueries({ queryKey: ['packages-and-labels'] });
  //     toast.success(`${data.name} đã được tạo thành công`);
  //   },
  // });
  const [editable, setEditable] = useState(false);

  return (
    <Form onSubmit={(values: TPackageAndLabelMutation) => mutation.mutate(values)} ref={ref}>
      {() => (
        <Card shadow="0" radius="0" px="xl">
          <Group justify="space-between" align="flex-start">
            <Field
              name="name"
              initialValue={data ? data.name : ''}
              onChangeValidate={z.string().min(1, { message: 'Trường bắt buộc' })}
            >
              {({ value, setValue, onBlur, errors }) => (
                <Textarea
                  autosize
                  ref={focusTrapRef}
                  minRows={1}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onBlur={onBlur}
                  required
                  aria-required
                  error={errors?.[0]}
                  radius="md"
                />
              )}
            </Field>
          </Group>
          <Tabs defaultValue="info">
            <Tabs.List>
              <Tabs.Tab value="info" leftSection={<Info size={16} />}>
                Thông tin chung
              </Tabs.Tab>
              <Tabs.Tab value="cylinder" leftSection={<Cylinder size={16} />}>
                Trục
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="info">
              <Accordion
                multiple
                radius="md"
                defaultValue={['item-1', 'item-2']}
                classNames={accClasses}
              >
                <Accordion.Item value="item-1">
                  <Accordion.Control>
                    <Text fw="500" size="sm" c="">
                      Thông tin cơ bản
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="sm">
                      <SimpleGrid cols={{ base: 1, md: 3 }} verticalSpacing="md">
                        <Field
                          name="uomId"
                          initialValue={data ? String(data.uomId) : ''}
                          onChangeValidate={z
                            .string()
                            .min(1, { message: 'Trường bắt buộc' })
                            .transform((val) => Number(val))}
                        >
                          {({ value, setValue, onBlur, errors }) => (
                            <CreatableSelect
                              radius="md"
                              size="sm"
                              required
                              value={value}
                              label="Đơn vị chính"
                              data={uomOptions}
                              onChange={(value) => {
                                setValue(value || '');
                              }}
                              onBlur={onBlur}
                              shouldClientFilter={true}
                              searchable
                              creatable
                              isLoadingOptions={uomSelectLoading}
                              rightSection={<ComboboxChevron />}
                              rightSectionPointerEvents="none"
                              error={errors?.[0]}
                            />
                          )}
                        </Field>
                        <Field name="secondaryUomId" initialValue={''}>
                          {({ value, setValue, onBlur }) => (
                            <CreatableSelect
                              size="sm"
                              radius="md"
                              value={value}
                              label="Đơn vị thứ hai"
                              data={uomOptions}
                              onChange={(value) => {
                                setValue(value || '');
                              }}
                              onBlur={onBlur}
                              searchable
                              shouldClientFilter={true}
                              creatable
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
                              radius="md"
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
                      <SimpleGrid cols={{ base: 1, md: 3 }} verticalSpacing="md">
                        <Field
                          name="partnerId"
                          initialValue={''}
                          onChangeValidate={z.string().transform((val) => Number(val))}
                        >
                          {({ value, setValue, onBlur }) => (
                            <CreatableSelect
                              size="sm"
                              radius="md"
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
                              radius="md"
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
                              radius="md"
                              label="Mã hàng hoá"
                              size="sm"
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                              onBlur={onBlur}
                            />
                          )}
                        </Field>
                      </SimpleGrid>
                      <Stack gap={2}>
                        <Text fw="500" size="sm">
                          Hình ảnh (tối đa 3 ảnh)
                        </Text>
                        <Group>
                          <Dropzone
                            onDrop={() => {}}
                            accept={IMAGE_MIME_TYPE}
                            h={150}
                            w={150}
                            radius="md"
                          >
                            <Text ta="center">Drop images here</Text>
                          </Dropzone>
                          <Image
                            radius="md"
                            h={150}
                            w={150}
                            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                          />
                          <Image
                            radius="md"
                            h={150}
                            w={150}
                            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                          />
                          <Image
                            radius="md"
                            h={150}
                            w={150}
                            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                          />
                          <Image
                            radius="md"
                            h={150}
                            w={150}
                            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                          />
                        </Group>
                      </Stack>
                      <Textarea label="Ghi chú" radius="md" />
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="item-2">
                  <Accordion.Control>
                    <Text fw="500" size="sm">
                      Thông tin kĩ thuật
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="sm">
                      <SimpleGrid
                        cols={{ base: 1, md: 2 }}
                        spacing={{ base: 10, sm: 'xl' }}
                        verticalSpacing="md"
                      >
                        <Field name="specs.dimension">
                          {({ value, setValue, onBlur }) => (
                            <TextInput
                              label="Kt  (rộng x cao)"
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                              onBlur={onBlur}
                              size="sm"
                              radius="md"
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
                              radius="md"
                            />
                          )}
                        </Field>
                      </SimpleGrid>
                      <SimpleGrid
                        cols={{ base: 1, md: 2 }}
                        spacing={{ base: 10, sm: 'xl' }}
                        verticalSpacing="md"
                      >
                        <TextInput label="Mã hàng hoá" />
                        <TextInput label="Mã hàng hoá" />
                      </SimpleGrid>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="item-3">
                  <Accordion.Control>
                    <Text fw="500" size="sm">
                      Trục
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="sm">
                      <SimpleGrid
                        cols={{ base: 1, md: 2 }}
                        spacing={{ base: 10, sm: 'xl' }}
                        verticalSpacing="md"
                      >
                        <TextInput label="Mã hàng hoá" />
                        <TextInput label="Mã hàng hoá" />
                      </SimpleGrid>
                      <SimpleGrid
                        cols={{ base: 1, md: 2 }}
                        spacing={{ base: 10, sm: 'xl' }}
                        verticalSpacing="md"
                      >
                        <TextInput label="Mã hàng hoá" />
                        <TextInput label="Mã hàng hoá" />
                      </SimpleGrid>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Tabs.Panel>
            <Tabs.Panel value="second">Second panel</Tabs.Panel>
          </Tabs>
        </Card>
      )}
    </Form>
  );
});

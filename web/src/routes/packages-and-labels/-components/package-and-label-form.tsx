import { uomsQueryOptions } from '@apis/query-options';
import { Uom } from '@app-types/uom';
import { CreatableSelect } from '@components/select';
import { createPackageAndLabel } from '@apis/package-and-label';
import { NewPackageAndLabel, PackageAndLabel } from '@app-types/package-and-label';
import {
  Divider,
  Grid,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  TextInput,
  Text,
  Box,
  Textarea,
  ComboboxChevron,
  ComboboxItem,
  OptionsFilter,
  Card,
  Tabs,
  Accordion,
  Image,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Field, Form } from 'houseform';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import classes from '@components/tab/Tab.module.css';
import accClasses from '@components/accordion/Accordion.module.css';
import {
  Cylinder,
  Info,
  NumberCircleThree,
  NumberCircleTwo,
  NumberOne,
} from '@phosphor-icons/react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';

export const PackageAndLabelForm = () => {
  const queryClient = useQueryClient();

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

  const mutation = useMutation({
    mutationFn: (values: NewPackageAndLabel) => createPackageAndLabel(values),
    onSuccess: (data: PackageAndLabel) => {
      queryClient.invalidateQueries({ queryKey: ['packages-and-labels'] });
      toast.success(`${data.name} đã được tạo thành công`);
    },
  });

  return (
    <Form onSubmit={(values: NewPackageAndLabel) => mutation.mutate(values)}>
      {() => (
        <Card shadow="0" radius="0">
          <Field name="name" initialValue={''}>
            {({ value, setValue, onBlur }) => (
              <Textarea
                styles={{
                  input: {
                    fontSize: '150%',
                  },
                }}
                autosize
                label="Tên hàng hoá"
                minRows={1}
                variant="unstyled"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={onBlur}
                required
                aria-required
              />
            )}
          </Field>
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
                    <Text fw="500" size="sm">
                      Thông tin cơ bản
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="sm">
                      <SimpleGrid cols={{ base: 1, md: 3 }} verticalSpacing="md">
                        <Field
                          name="uomId"
                          initialValue={''}
                          onChangeValidate={z.string().transform((val) => Number(val))}
                        >
                          {({ value, setValue, onBlur }) => (
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
                        <TextInput label="Mã hàng hoá" radius="md" />
                        <TextInput label="Mã hàng hoá" radius="md" />
                        <TextInput label="Mã hàng hoá" radius="md" />
                      </SimpleGrid>
                      <Stack gap={2}>
                        <Text fw="500" size="sm">
                          Hình ảnh (tối đa 3 ảnh)
                        </Text>
                        <Group>
                          <Dropzone onDrop={() => {}} accept={IMAGE_MIME_TYPE} h={150} w={150}>
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
};

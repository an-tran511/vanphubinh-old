import { FileRoute, useParams } from '@tanstack/react-router';
import {
  Button,
  Card,
  Grid,
  Stack,
  Group,
  Badge,
  Text,
  Title,
  Textarea,
  Avatar,
  Flex,
  TextInput,
  SimpleGrid,
  Box,
  Divider,
  em,
  Tabs,
  Container,
  Collapse,
} from '@mantine/core';
import { packageAndLabelQueryOptions } from '@/apis/query-options';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { useMediaQuery } from '@mantine/hooks';
import { Show } from '@components/crud/show';
import classes from '@components/tab/Tab.module.css';
import { Form } from 'houseform';
import { PackageAndLabelForm } from './-components/package-and-label-form';
export const Route = new FileRoute('/packages-and-labels/$id').createRoute({
  component: DetailComponent,
  errorComponent: () => <div>error</div>,
  loader: ({ context: { queryClient }, params }) => {
    queryClient.ensureQueryData(packageAndLabelQueryOptions(params.id));
  },
});

export function DetailComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(packageAndLabelQueryOptions(id));
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Show title="Bao bì & nhãn mác">
      <PackageAndLabelForm />
    </Show>
  );
}

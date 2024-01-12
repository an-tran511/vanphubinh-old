import {
  Group,
  Stack,
  Card,
  Box,
  Button,
  Title,
  Pagination,
  Text,
  Breadcrumbs,
  Anchor,
} from '@mantine/core';
import { CaretRight, House } from '@phosphor-icons/react';
import { useNavigate } from '@tanstack/react-router';
import { ReactNode } from 'react';

interface ListProps {
  children: ReactNode;
  title: string;
  onCreateHandler?: () => void;
  pagination?: {
    isLoading: boolean;
    total: number;
    page: number;
    lastPage: number;
    onPageChange: (page: number) => void;
  };
}

export const List = (props: ListProps) => {
  const { title, children, onCreateHandler, pagination } = props;
  const { page, onPageChange, lastPage, isLoading, total } = pagination ?? {};
  const navigate = useNavigate();
  const defaultHandleClick = () => navigate({ to: `create` });

  const createHandler =
    typeof onCreateHandler === 'function' ? onCreateHandler : defaultHandleClick;
  const items = [
    {
      title: <House size={12} />,
      href: '#',
    },
    { title: 'Bao bì', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} size="xs">
      {item.title}
    </Anchor>
  ));
  return (
    <Stack h={{ base: 'calc(100vh - 60px)', md: '100vh' }} gap="0">
      <Box
        px="lg"
        py="lg"
        bg="white"
        style={{
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Group justify="space-between" mt="0">
          <Title order={2}>{title}</Title>
          <Button variant="filled" justify="space-between" onClick={createHandler}>
            Thêm {title.toLowerCase()}
          </Button>
        </Group>
      </Box>
      <Card py="0" px="0" h="100%" mah="100%" bg="white">
        {children}
      </Card>
      {page && onPageChange && lastPage && (
        <Box bg="white" px={{ base: 'md', md: 'lg' }}>
          <Group justify="space-between" py={{ base: 'xs', md: 'sm' }}>
            <Text size="sm" c="dimmed">
              Hiện{' '}
              <b>
                {(page - 1) * 30 + 1} - {page === lastPage ? total : page * 30}
              </b>{' '}
              trong tổng <b>{total}</b>
            </Text>
            <Pagination
              size="sm"
              disabled={isLoading}
              value={page}
              onChange={onPageChange}
              total={lastPage}
              withEdges
            />
          </Group>
        </Box>
      )}
    </Stack>
  );
};

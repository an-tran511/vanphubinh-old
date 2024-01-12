import { FileRoute } from '@tanstack/react-router';
import { Grid, Stack, Tabs } from '@mantine/core';

export const Route = new FileRoute('/packages-and-labels/$id').createRoute({
  component: DetailComponent,
  errorComponent: () => <div>error</div>,
});

export function DetailComponent() {
  return (
    <Stack h={{ base: 'calc(100vh - 60px)', md: '100vh' }} pt="lg" gap="0">
      <Grid>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Tabs defaultValue="gallery">
            <Tabs.List>
              <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
              <Tabs.Tab value="messages">Messages</Tabs.Tab>
              <Tabs.Tab value="settings">Settings</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="gallery">Gallery tab content</Tabs.Panel>

            <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>

            <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
          </Tabs>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}></Grid.Col>
      </Grid>
    </Stack>
  );
}

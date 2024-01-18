import { FileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { TPackageAndLabelQueryOptions } from '@/apis/query-options';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { Show } from '@components/crud/show';
import { FormInstance } from 'houseform';
import { PackageAndLabelForm } from './-components/package-and-label-form';
import { TPackageAndLabel, TPackageAndLabelMutation } from '@/app-types/package-and-label';
import { toast } from 'sonner';
import { createPackageAndLabel } from '@/apis/package-and-label';
import { useRef } from 'react';
export const Route = new FileRoute('/packages-and-labels/$id').createRoute({
  component: DetailComponent,
  errorComponent: () => <div>error</div>,
  loader: ({ context: { queryClient }, params }) => {
    queryClient.ensureQueryData(TPackageAndLabelQueryOptions(params.id));
  },
});

export function DetailComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(TPackageAndLabelQueryOptions(id));
  const formRef = useRef<FormInstance<TPackageAndLabelMutation>>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: '/packages-and-labels/create' });

  //Mutation
  const mutation = useMutation({
    mutationFn: (values: TPackageAndLabelMutation) => createPackageAndLabel(values),
    onSuccess: (data: TPackageAndLabel) => {
      const itemId = data.id;
      queryClient.invalidateQueries({ queryKey: ['packages-and-labels'] });
      navigate({ to: '/packages-and-labels/$itemId', params: { itemId } });

      toast.success(`${data.name} đã được tạo thành công`);
    },
  });

  const doSubmit = () => {
    formRef?.current?.submit();
  };
  return (
    <Show title="Bao bì & nhãn mác" submitHandler={doSubmit}>
      <PackageAndLabelForm mutation={mutation} formRef={formRef} data={data} />
    </Show>
  );
}

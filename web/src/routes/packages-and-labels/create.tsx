import { FormInstance } from 'houseform';
import { Create } from '@components/crud/create';
import { FileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { TPackageAndLabelMutation, TPackageAndLabel } from '@app-types/package-and-label';
import { createPackageAndLabel } from '@apis/package-and-label';
import { toast } from 'sonner';
import { PackageAndLabelForm } from './-components/package-and-label-form';
import { redirect } from '@tanstack/react-router';

export const Route = new FileRoute('/packages-and-labels/create').createRoute({
  component: CreateComponent,
});

export function CreateComponent() {
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
    <Create title="Thêm sản phẩm bao bì" submitHandler={doSubmit}>
      <PackageAndLabelForm mutation={mutation} ref={formRef} />
    </Create>
  );
}

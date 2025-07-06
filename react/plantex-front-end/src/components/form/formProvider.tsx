import { UseFormReturn, FormProvider as Form } from "react-hook-form";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  // eslint-disable-next-line
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
};

export default function FormProvider({ children, onSubmit, methods }: Props) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}

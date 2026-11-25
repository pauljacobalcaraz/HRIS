import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import type { SalaryRecord } from '../types'

const schema = z.object({
  basicPay: z.number().min(0, 'Must be a positive amount'),
  riceAllowance: z.number().min(0),
  transportationAllowance: z.number().min(0),
  clothingAllowance: z.number().min(0),
})

type SalaryFormValues = z.infer<typeof schema>

interface SalaryDialogProps {
  open: boolean
  salary?: SalaryRecord
  employeeName?: string
  onClose: () => void
  onSubmit: (values: SalaryFormValues) => void
  isSubmitting?: boolean
}

export function SalaryDialog({ open, salary, employeeName, onClose, onSubmit, isSubmitting }: SalaryDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SalaryFormValues>({
    resolver: zodResolver(schema),
    values: salary
      ? {
          basicPay: salary.basicPay,
          riceAllowance: salary.riceAllowance,
          transportationAllowance: salary.transportationAllowance,
          clothingAllowance: salary.clothingAllowance,
        }
      : { basicPay: 0, riceAllowance: 0, transportationAllowance: 0, clothingAllowance: 0 },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const numberField = (name: keyof SalaryFormValues, label: string) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          type="number"
          label={label}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          onChange={(e) => field.onChange(Number(e.target.value))}
          fullWidth
          required
        />
      )}
    />
  )

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Edit salary — {employeeName}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          {numberField('basicPay', 'Basic pay (monthly)')}
          {numberField('riceAllowance', 'Rice allowance')}
          {numberField('transportationAllowance', 'Transportation allowance')}
          {numberField('clothingAllowance', 'Clothing allowance')}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

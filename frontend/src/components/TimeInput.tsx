import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type Props = {
  value: string
  onChange: (val: string) => void
  label: string
  id?: string
}

export default function TimeInput({ value, onChange, label, id }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        type="time"
        id={id}
        step="60"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

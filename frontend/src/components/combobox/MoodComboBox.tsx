// components/ComboBox/MoodComboBox.tsx
import { BaseComboBox, type ComboOption } from "./BaseComboBox"

type MoodComboBoxProps = {
  options: ComboOption[]
  value: string
  onChange: (val: string) => void
  className?: string
}


export function MoodComboBox({options, value, onChange, className }: MoodComboBoxProps) {
  return (
    <BaseComboBox
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Mood"
      className={className}
    />
  )
}

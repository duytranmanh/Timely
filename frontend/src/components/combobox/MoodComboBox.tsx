// components/ComboBox/MoodComboBox.tsx
import { BaseComboBox, type ComboOption } from "./BaseComboBox"

type MoodComboBoxProps = {
  value: string
  onChange: (val: string) => void
  className?: string
}

const moodOptions: ComboOption[] = [
  { value: "tired", label: "Tired" },
  { value: "happy", label: "Happy" },
  { value: "angry", label: "Angry" },
]

export function MoodComboBox({ value, onChange, className }: MoodComboBoxProps) {
  return (
    <BaseComboBox
      options={moodOptions}
      value={value}
      onChange={onChange}
      placeholder="Mood"
      className={className}
    />
  )
}

"use client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"

type Props = {
  onSelect: (id: string) => void
}

//todo fetch patients
const patients = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Michael Johnson" },
]

export default function PatientDropDown({ onSelect }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = useState<number | null>(null)

  
  const t = useTranslations()
  const selectedPatient = patients.find((p) => p.id === selectedPatientId)

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
  }, [open])
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          className="w-full justify-between font-normal"
        >
          {selectedPatient ? selectedPatient.name : t("SelectPatients")}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        style={{ width: triggerWidth ?? "auto" }}
        className="p-0"
      >
        <Command>
          <CommandInput placeholder={t("SearchPatients")} />
          <CommandList>
            <CommandEmpty>{t("NoPatients")}</CommandEmpty>
            {patients.map((patient) => (
              <CommandItem
                key={patient.id}
                onSelect={() => {
                  onSelect(patient.id)
                  setSelectedPatientId(patient.id)
                  setOpen(false)
                }}
              >
                {patient.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

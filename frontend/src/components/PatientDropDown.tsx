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
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { searchPatient } from "@/api/action"
import LoadingSpinner from "./LoadingSpinner"
import { PatientInfo } from "../../generated"
import { debounce } from "lodash"

type Props = {
  onSelect: (id: string) => void,
  patientId?: string
}

export default function PatientDropDown({ onSelect, patientId = ''}: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patientId)
  const [selectedPatientName, setSelectedPatientName] = useState<string>("")
  const [patients, setPatients] = useState<PatientInfo[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = useState<number | null>(null)
  const t = useTranslations()

  const callSearchPatient = useCallback(async (value: string) => {
    setIsSearching(true)
    const data = await searchPatient(value)
    if (data && data.data) {
      setPatients(data.data)
    } else {
      setPatients([])
    }
    setIsSearching(false)
  }, [])

  const onSearchTextChange = useCallback(
    debounce(callSearchPatient, 300),
    []
  )

  const renderPatients = useCallback(() => {
    if (isSearching) {
      return <div className="flex justify-center my-2"><LoadingSpinner/></div>
    }
    return (
      <CommandList>
        {patients.length > 0 ? (
          patients.map((patient: PatientInfo) => (
            <CommandItem
              key={patient.id}
              onSelect={() => {
                onSelect(patient.id)
                setSelectedPatientId(patient.id)
                setOpen(false)
              }}
            >
              {`${patient.firstName} ${patient.lastName}`}
            </CommandItem>
          ))
        ) : (
          <CommandEmpty>{t("NoPatients")}</CommandEmpty>
        )}
      </CommandList>
    )
  }, [isSearching, patients])

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
  }, [open])

  useEffect(() => {
    if (selectedPatientId) {
      const patient = patients.filter((x) => x.id === selectedPatientId).at(0)
      setSelectedPatientName(`${patient?.firstName} ${patient?.lastName}`)
    }
  }, [selectedPatientId, patients])

  useEffect(() => {
    callSearchPatient("")
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          className="w-full justify-between font-normal"
        >
          {selectedPatientName ? selectedPatientName : t("SelectPatients")}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        style={{ width: triggerWidth ?? "auto" }}
        className="p-0"
      >
        <Command>
          <CommandInput
            placeholder={t("SearchPatients")}
            onValueChange={(value) => onSearchTextChange(value)}
          />
          {renderPatients()}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

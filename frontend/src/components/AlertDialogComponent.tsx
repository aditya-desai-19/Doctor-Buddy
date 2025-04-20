"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useTranslations } from "next-intl"
import { Button } from "./ui/button"

type Props = {
  dialogButtonText: string
  alertTitle: string
  onDelete: () => void 
  alertDescription?: string
  dialogButtonClassName?: string
  dialogActionButtonText?: string
  dialogActionClassName?: string
  dialogButtonDisabled?: boolean
}

const AlertDialogComponent = ({
  dialogButtonText,
  alertTitle,
  alertDescription,
  dialogActionButtonText = "Continue",
  dialogActionClassName,
  dialogButtonClassName,
  dialogButtonDisabled,
  onDelete
}: Props) => {
  const t = useTranslations()

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className={dialogButtonClassName} disabled={dialogButtonDisabled}>{dialogButtonText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
          {alertDescription && (
            <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction className={dialogActionClassName} onClick={onDelete}>
            {dialogActionButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDialogComponent

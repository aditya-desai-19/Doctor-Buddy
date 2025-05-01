"use client"

import { DebouncedFunc } from "lodash"
import { Input } from "./ui/input"

type Props = {
  onChange: DebouncedFunc<(e: any) => Promise<void>>
}

export default function SearchInput({onChange}: Props) {
  return (
    <Input
      placeholder="Search..."
      className="w-1/4 my-2 max-sm:w-1/2"
      onChange={onChange}
    />
  )
}

"use client"

type Props = {
  title: string
}

export default function SubHeading({title}: Props) {
  return (
    <h2 className="my-6 text-xl text-blue-900">{title}</h2>
  )
}
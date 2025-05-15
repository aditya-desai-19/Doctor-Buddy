"use client"

import PaymentListView from "@/components/PaymentListView"
import withProtectedRoute from "@/components/withProtectedRoute"

const PaymentListViewPage = () => {
  return <PaymentListView />
}

export default withProtectedRoute(PaymentListViewPage)

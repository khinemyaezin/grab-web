import { matchShellBreadcrumbs } from "@khinemyaezin/seller-contracts"
import { useState, useEffect } from "react"
import { useLocation } from "react-router"
import { useAuth } from "../app/AuthContext";

export function useBreadcrumbs() {
  const { pathname } = useLocation()
  const { platform } = useAuth()
  const [leaf, setLeaf] = useState<string | null>(null)
  const [segments, setSegments] = useState<Record<string, string>>({})

  useEffect(() => {
    return platform.events.subscribe("shell:breadcrumb:v1", (payload) => {
      if (payload.leaf !== undefined) {
        setLeaf(payload.leaf)
      }
      if (payload.segments) {
        setSegments(prev => {
          const newSegments = { ...prev }
          Object.entries(payload.segments!).forEach(([key, value]) => {
            if (value === null) delete newSegments[key]
            else newSegments[key] = value
          })
          return newSegments
        })
      }
    })
  }, [platform.events])

  useEffect(() => {
    setLeaf(null)
    setSegments({})
  }, [pathname])

  return matchShellBreadcrumbs(pathname, segments).map((crumb, index, all) => {
    const isLast = index === all.length - 1
    if (isLast && leaf) {
      return { ...crumb, label: leaf, to: undefined }
    }
    return crumb
  })
}
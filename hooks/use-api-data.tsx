"use client"

import { useState, useCallback, useEffect } from "react"

interface UseApiSubmitOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useApiSubmit<T>(submitFunction: (data: any) => Promise<T>, options: UseApiSubmitOptions = {}) {
  const { onSuccess, onError } = options
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const submit = useCallback(
    async (data: any) => {
      setIsSubmitting(true)
      setError(null)

      try {
        await submitFunction(data)
        if (onSuccess) {
          onSuccess()
        }
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(err?.message || "Unknown error")
        setError(error)
        if (onError) {
          onError(error)
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [submitFunction, onSuccess, onError],
  )

  return { submit, isSubmitting, error }
}

interface UseApiDataOptions<T> {
  initialData?: T
  dependencies?: any[]
  onError?: (error: Error) => void
  onSuccess?: (data: T) => void
}

export function useApiData<T>(fetchFunction: () => Promise<T>, options: UseApiDataOptions<T> = {}) {
  const { initialData, dependencies = [], onError, onSuccess } = options
  const [data, setData] = useState<T | undefined>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await fetchFunction()
      setData(result)
      if (onSuccess) {
        onSuccess(result)
      }
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || "Unknown error")
      setError(error)
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [fetchFunction, onError, onSuccess])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, dependencies)

  return {
    data,
    isLoading,
    error,
    refresh,
  }
}

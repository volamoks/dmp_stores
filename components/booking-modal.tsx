'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DMP } from '../types/store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { useRouter } from 'next/navigation'

interface BookingModalProps {
  dmp: DMP
  months: string[]
  onClose: () => void
}

export default function BookingModal({ dmp, months, onClose }: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const [bookingData, setBookingData] = useState<{dmp: DMP, months: string[], totalPrice: number} | null>(null)

  useEffect(() => {
    if (dmp && months.length > 0) {
      const totalPrice = dmp.price * months.length
      setBookingData({
        dmp,
        months,
        totalPrice
      })
      console.log('Booking data initialized:', {
        dmp,
        months,
        totalPrice
      })
    }
  }, [dmp, months])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      router.push('/login')
      return
    }

    if (!bookingData) {
      console.error('No booking data available')
      alert('Booking data is missing')
      return
    }

    const { dmp, months, totalPrice } = bookingData

    // Validate DMP data
    if (!dmp || typeof dmp !== 'object') {
      console.error('Invalid DMP object:', dmp)
      alert('Invalid DMP data')
      return
    }

    // Validate uniqueId
    if (!dmp.uniqueId || typeof dmp.uniqueId !== 'string') {
      console.error('Invalid uniqueId:', dmp.uniqueId)
      alert('Invalid zone ID')
      return
    }

    // Validate months
    if (!Array.isArray(months) || months.length === 0) {
      console.error('Invalid months array:', months)
      alert('Please select at least one month')
      return
    }

    // Validate price
    if (typeof totalPrice !== 'number' || isNaN(totalPrice) || totalPrice <= 0) {
      console.error('Invalid total price:', totalPrice)
      alert('Invalid price calculation')
      return
    }

    setIsSubmitting(true)

    try {
      const requestData = {
        dmpId: dmp.uniqueId,
        months: months,
        totalPrice: totalPrice
      }

      console.log('Sending booking request:', requestData)

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const responseText = await response.text()
      console.log('Server response:', response.status, responseText)

      if (!response.ok) {
        throw new Error(responseText || 'Failed to create booking')
      }

      // Redirect to main page after successful booking
      router.push('/')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert(error instanceof Error ? error.message : 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatMonthYear = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleString('ru', { month: 'long', year: 'numeric' })
  }

  if (!bookingData) {
    console.error('No booking data available for render')
    return null
  }

  const { totalPrice } = bookingData

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent aria-describedby="booking-form-description">
        <DialogHeader>
          <DialogTitle>Подтверждение бронирования</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" id="booking-form-description">
          <div className="space-y-2">
            <Label>Выбранные месяцы:</Label>
            <div className="bg-gray-50 p-3 rounded-md space-y-1">
              {months.map(month => (
                <div key={month} className="text-sm text-gray-700">
                  {formatMonthYear(month)}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Информация о ДМП:</Label>
            <div className="bg-gray-50 p-3 rounded-md space-y-2">
              <div className="text-sm text-gray-700">
                <span className="font-medium">Назначение:</span> {dmp.purpose}
              </div>
              <div className="text-sm text-gray-700">
                <span className="font-medium">Оборудование:</span> {dmp.equipment}
              </div>
              <div className="text-sm text-gray-700">
                <span className="font-medium">Зона:</span> {dmp.zoneId}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Стоимость:</Label>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  {new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                  }).format(dmp.price)} × {months.length} {months.length === 1 ? 'месяц' : 'месяца'}
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                  }).format(totalPrice)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Обработка...' : 'Подтвердить бронирование'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

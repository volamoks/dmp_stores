'use client'

import { useState } from 'react'
import { DMP } from '@/types/store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BookingModalProps {
  dmp: DMP
  month: string
  onClose: () => void
}

export default function BookingModal({ dmp, month, onClose }: BookingModalProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет логика отправки данных на сервер
    console.log('Бронирование:', { dmp, month, startDate, endDate })
    onClose()
  }

  const [year, monthNum] = month.split('-')
  const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('default', { month: 'long' })

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Забронировать ДМП на {monthName} {year}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="startDate">Дата начала</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={`${month}-01`}
              max={`${month}-31`}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">Дата окончания</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || `${month}-01`}
              max={`${month}-31`}
              required
            />
          </div>
          <Button type="submit">Подтвердить бронирование</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


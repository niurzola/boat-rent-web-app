'use client';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type Rezervacija = {
  DATUM: Date;
  UKUPNA_CIJENA: number | null;
};

export function PrihodiList({ rezervacije }: { rezervacije: Rezervacija[] }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  function formatDate(d: Date) {
    return d.toISOString().split('T')[0];
  }

  function formatDisplayDate(d: Date) {
    return d.toLocaleDateString('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function shiftDay(offset: number) {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + offset);
      return next;
    });
  }

  const total = rezervacije.reduce(
    (sum, r) =>
      new Date(r.DATUM).toISOString().split('T')[0] === formatDate(selectedDate)
        ? sum + (r.UKUPNA_CIJENA ?? 0)
        : sum,
    0
  );

  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prihodi</h1>
        <Button onClick={() => setCalendarOpen(true)}>Odaberi dan</Button>
      </div>

      {/* Calendar dialog */}
      <Sheet open={calendarOpen} onOpenChange={setCalendarOpen}>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle>Odaberi dan</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(day) => {
                if (day) {
                  setSelectedDate(day);
                  setCalendarOpen(false);
                }
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Date navigation */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon-sm" onClick={() => shiftDay(-1)}>
          ←
        </Button>
        <p className="flex-1 text-center text-sm font-medium">{formatDisplayDate(selectedDate)}</p>
        <Button variant="outline" size="icon-sm" onClick={() => shiftDay(1)}>
          →
        </Button>
      </div>

      {/* Day total */}
      <div className="rounded-lg border bg-muted/50 p-4 text-center">
        <div className="text-sm text-muted-foreground">
          Ukupno za {formatDisplayDate(selectedDate)}
        </div>
        <div className="mt-1 text-3xl font-bold">{total}€</div>
      </div>
    </div>
  );
}

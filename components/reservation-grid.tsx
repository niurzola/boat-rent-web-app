'use client';
import { useState, useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldContent, FieldError, FieldGroup } from '@/components/ui/field';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  createReservation,
  updateReservation,
  deleteReservation,
} from '@/lib/actions/reservation-actions';

type Brod = {
  ID_BRODA: number;
  MODEL_BRODA: string;
  REGISTRACIJA: string;
  ZAVRSNI_KATEGORIJA: {
    NAZIV: string;
    ZAVRSNI_CIJENA: { TRAJANJE_NAJMA: number; CIJENA: number | null }[];
  } | null;
};

type Rezervacija = {
  ID_REZERVACIJE: number;
  ID_BRODA: number;
  ID_KLIJENTA: number;
  DATUM: Date;
  VRIJEME: Date;
  VRIJEME_KRAJA: Date | null;
  DEPOZIT: number | null;
  UKUPNA_CIJENA: number | null;
  KOMENTAR: string | null;
  ZAVRSNI_KLIJENT: {
    IME: string;
    PREZIME: string;
    TELEFON: string | null;
    NAPOMENA: string | null;
  };
};

const INITIAL_STATE = { zodErrors: null as any, message: null as string | null, success: false };
const DELETE_INITIAL_STATE = { message: null as string | null, success: false };

export function ReservationGrid({
  brodovi,
  rezervacije,
}: {
  brodovi: Brod[];
  rezervacije: Rezervacija[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ brod: Brod } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [startHour, setStartHour] = useState(8);
  const [startMinute, setStartMinute] = useState(0);
  const [editingReservation, setEditingReservation] = useState<Rezervacija | null>(null);

  const [createState, createFormAction] = useActionState(createReservation, INITIAL_STATE);
  const [updateState, updateFormAction] = useActionState(updateReservation, INITIAL_STATE);

  const state = editingReservation ? updateState : createState;
  const formAction = editingReservation ? updateFormAction : createFormAction;

  const deleteRef = useRef<HTMLFormElement>(null);
  const [deleteState, deleteAction] = useActionState(deleteReservation, DELETE_INITIAL_STATE);

  useEffect(() => {
    if (state.success) {
      setSheetOpen(false);
      setSelectedSlot(null);
      setEditingReservation(null);
      window.location.reload();
    }
  }, [state.success]);

  useEffect(() => {
    if (deleteState.success) {
      setSheetOpen(false);
      setSelectedSlot(null);
      setEditingReservation(null);
      window.location.reload();
    }
  }, [deleteState.success]);

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

  function handleSlotClick(brod: Brod) {
    setSelectedSlot({ brod });
    setSelectedIndex(0);
    setStartHour(8);
    setStartMinute(0);
    setEditingReservation(null);
    setSheetOpen(true);
  }

  function handleEditClick(rez: Rezervacija, brod: Brod) {
    setSelectedSlot({ brod });

    const cijenaOptions = brod.ZAVRSNI_KATEGORIJA?.ZAVRSNI_CIJENA ?? [];
    const durationMinutes = rez.VRIJEME_KRAJA
      ? (new Date(rez.VRIJEME_KRAJA).getTime() - new Date(rez.VRIJEME).getTime()) / 60000
      : 60;
    const durationHours = durationMinutes / 60;
    const matchIndex = cijenaOptions.findIndex(
      (c) => c.TRAJANJE_NAJMA === Math.floor(durationHours)
    );
    setSelectedIndex(matchIndex >= 0 ? matchIndex : 0);

    const start = new Date(rez.VRIJEME);
    setStartHour(start.getHours());
    setStartMinute(start.getMinutes());

    setEditingReservation(rez);
    setSheetOpen(true);
  }

  function handleDelete(e: React.MouseEvent) {
    if (!confirm('Sigurno želiš obrisati ovu rezervaciju?')) {
      e.preventDefault();
      return;
    }
    deleteRef.current?.requestSubmit();
  }

  const cijena = selectedSlot?.brod.ZAVRSNI_KATEGORIJA?.ZAVRSNI_CIJENA ?? [];
  const selected = cijena[selectedIndex];
  const duration = selected?.TRAJANJE_NAJMA ?? 0;
  const price = selected?.CIJENA ?? 0;
  const endHour = (startHour + duration) % 24;
  const vrijemeOd = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
  const vrijemeDo = `${String(endHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;

  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rezervacije</h1>
        <Button onClick={() => setCalendarOpen(true)}>Nova rezervacija</Button>
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

      {/* Boat grid */}
      <div className="space-y-4">
        {brodovi.map((brod) => {
          const dayReservations = rezervacije
            .filter((r) => {
              if (r.ID_BRODA !== brod.ID_BRODA) return false;
              const rDate = new Date(r.DATUM).toISOString().split('T')[0];
              return rDate === formatDate(selectedDate);
            })
            .sort((a, b) => new Date(a.VRIJEME).getTime() - new Date(b.VRIJEME).getTime())
            .slice(0, 3);

          const emptySlots = 3 - dayReservations.length;

          return (
            <div key={brod.ID_BRODA} className="rounded-lg border p-4 space-y-3">
              <div className="font-medium">
                {brod.MODEL_BRODA}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({brod.REGISTRACIJA}) · {brod.ZAVRSNI_KATEGORIJA?.NAZIV ?? 'Bez kategorije'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {dayReservations.map((r) => {
                  const timeFrom = new Date(r.VRIJEME).toTimeString().slice(0, 5);
                  const timeTo = r.VRIJEME_KRAJA
                    ? new Date(r.VRIJEME_KRAJA).toTimeString().slice(0, 5)
                    : '??:??';
                  const depozit = Number(r.DEPOZIT ?? 0);
                  const ukupnaCijena = Number(r.UKUPNA_CIJENA ?? 0);
                  const telefon = r.ZAVRSNI_KLIJENT.TELEFON;
                  const napomena = r.ZAVRSNI_KLIJENT.NAPOMENA;
                  return (
                    <button
                      key={r.ID_REZERVACIJE}
                      onClick={() => handleEditClick(r, brod)}
                      className="rounded-lg border bg-muted p-3 text-center text-sm cursor-pointer hover:bg-accent transition"
                    >
                      <div className="font-medium">
                        {timeFrom} – {timeTo}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {r.ZAVRSNI_KLIJENT.IME} {r.ZAVRSNI_KLIJENT.PREZIME}
                      </div>
                      {telefon && (
                        <div className="text-xs text-muted-foreground mt-1">📞 {telefon}</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        Cijena: {ukupnaCijena}€ · Depozit: {depozit}€
                      </div>
                      {napomena && (
                        <div className="text-xs text-muted-foreground mt-1">📝 {napomena}</div>
                      )}
                    </button>
                  );
                })}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <button
                    key={`empty-${i}`}
                    onClick={() => handleSlotClick(brod)}
                    className="rounded-lg border p-3 text-center text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition"
                  >
                    <div className="font-medium">+</div>
                    <div className="text-xs text-muted-foreground">
                      Termin {dayReservations.length + i + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reservation form sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{editingReservation ? 'Uredi rezervaciju' : 'Nova rezervacija'}</SheetTitle>
            <SheetDescription>
              {selectedSlot?.brod.MODEL_BRODA} · {formatDisplayDate(selectedDate)}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <form action={formAction} className="p-4 space-y-4">
              {editingReservation && (
                <>
                  <input
                    type="hidden"
                    name="idRezervacije"
                    value={editingReservation.ID_REZERVACIJE}
                  />
                  <input type="hidden" name="idKlijenta" value={editingReservation.ID_KLIJENTA} />
                </>
              )}
              <input type="hidden" name="brodId" value={selectedSlot?.brod.ID_BRODA ?? ''} />
              <input type="hidden" name="datum" value={formatDate(selectedDate)} />
              <input type="hidden" name="vrijemeOd" value={vrijemeOd} />
              <input type="hidden" name="vrijemeDo" value={vrijemeDo} />

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="trajanje">Trajanje</FieldLabel>
                  <FieldContent>
                    <select
                      id="trajanje"
                      value={selectedIndex}
                      onChange={(e) => setSelectedIndex(Number(e.target.value))}
                      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5"
                      disabled={cijena.length === 0}
                    >
                      {cijena.length === 0 && <option value="">Nema definiranih cijena</option>}
                      {cijena.map((c, i) => (
                        <option key={i} value={i}>
                          {c.TRAJANJE_NAJMA}h - {c.CIJENA ?? 0}€
                        </option>
                      ))}
                    </select>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Vrijeme početka</FieldLabel>
                  <FieldContent>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={0}
                        max={23}
                        value={startHour}
                        onChange={(e) =>
                          setStartHour(Math.min(23, Math.max(0, Number(e.target.value))))
                        }
                        className="w-16"
                      />
                      <span className="text-muted-foreground">:</span>
                      <Input
                        type="number"
                        min={0}
                        max={59}
                        value={startMinute}
                        onChange={(e) =>
                          setStartMinute(Math.min(59, Math.max(0, Number(e.target.value))))
                        }
                        className="w-16"
                      />
                    </div>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Vrijeme završetka</FieldLabel>
                  <FieldContent>
                    <p className="h-8 flex items-center text-sm">{vrijemeDo}</p>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Ukupna cijena</FieldLabel>
                  <FieldContent>
                    <p className="h-8 flex items-center text-sm font-medium">{price ?? 0}€</p>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="ime">Ime</FieldLabel>
                  <FieldContent>
                    <Input
                      id="ime"
                      name="ime"
                      defaultValue={editingReservation?.ZAVRSNI_KLIJENT.IME ?? ''}
                    />
                    <FieldError errors={state?.zodErrors?.ime} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="prezime">Prezime</FieldLabel>
                  <FieldContent>
                    <Input
                      id="prezime"
                      name="prezime"
                      defaultValue={editingReservation?.ZAVRSNI_KLIJENT.PREZIME ?? ''}
                    />
                    <FieldError errors={state?.zodErrors?.prezime} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="telefon">Telefon</FieldLabel>
                  <FieldContent>
                    <Input
                      id="telefon"
                      name="telefon"
                      defaultValue={editingReservation?.ZAVRSNI_KLIJENT.TELEFON ?? ''}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="napomena">Napomena</FieldLabel>
                  <FieldContent>
                    <Input
                      id="napomena"
                      name="napomena"
                      defaultValue={editingReservation?.ZAVRSNI_KLIJENT.NAPOMENA ?? ''}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="depozit">Depozit (€)</FieldLabel>
                  <FieldContent>
                    <Input
                      id="depozit"
                      name="depozit"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={editingReservation?.DEPOZIT ?? 0}
                    />
                    <FieldError errors={state?.zodErrors?.depozit} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="komentar">Komentar</FieldLabel>
                  <FieldContent>
                    <Input
                      id="komentar"
                      name="komentar"
                      defaultValue={editingReservation?.KOMENTAR ?? ''}
                    />
                  </FieldContent>
                </Field>
              </FieldGroup>

              {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

              <SheetFooter>
                <Button type="submit" className="w-full" disabled={cijena.length === 0}>
                  {editingReservation ? 'Spremi promjene' : 'Spremi rezervaciju'}
                </Button>
              </SheetFooter>
            </form>

            {editingReservation && (
              <form ref={deleteRef} action={deleteAction} className="p-4 pt-0">
                <input
                  type="hidden"
                  name="idRezervacije"
                  value={editingReservation.ID_REZERVACIJE}
                />
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                >
                  Obriši rezervaciju
                </Button>
                {deleteState?.message && (
                  <p className="mt-2 text-sm text-destructive">{deleteState.message}</p>
                )}
              </form>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

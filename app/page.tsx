export default function Page() {
  return (
    <div className="flex flex-col gap-4 min-h-screen mx-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 shadow-sm">
          <h1 className="text-center text-lg font-medium">Dostupno</h1>
          <p className="text-center ">8</p>
        </div>
        <div className="border rounded-lg p-4 shadow-sm">
          <h1 className="text-center text-lg font-medium">Broj rezervacija danas</h1>
          <p className="text-center">3</p>
        </div>
        <div className="border rounded-lg p-4 shadow-sm">
          <h1 className="text-center text-lg font-medium">Obavijesti</h1>
        </div>
      </div>
      <div className="border rounded-lg p-4 shadow-sm w-full">
        <h1 className="text-center">Raspored</h1>
      </div>
    </div>
  );
}

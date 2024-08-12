import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSessionContext } from "@/contexts/SessionContext";
import { Check, X } from "lucide-react";
import { useState, forwardRef, useImperativeHandle } from "react";
import { Input } from "./ui/input";
import { Checkbox } from "@/components/ui/checkbox";

function getBooleanLogo(value: boolean) {
  return value ? (
    <Check className="text-red-500" />
  ) : (
    <X className="text-green-500" />
  );
}

export interface Metrics {
  pushups: number;
  pullups: number;
  run_meters: number;
  bike_meters: number;
  stretch_notes: string;
  cardio_notes: string;
  strength_notes: string;
  smoke: boolean;
  alcohol: boolean;
  edibles: boolean;
  pornography: boolean;
  youtube: boolean;
  pages_read: number;
}

export interface DailyMetricsProps {
  date: string;
  data?: Metrics;
}

export interface DailyMetricsHandle {
  getTableData: () => Metrics;
}

const DailyMetrics = forwardRef<DailyMetricsHandle, DailyMetricsProps>(
  function DailyMetrics(
    { data, date }: DailyMetricsProps,
    ref: React.ForwardedRef<DailyMetricsHandle>
  ) {
    const session = useSessionContext();

    const [pushups, setPushups] = useState<number>(data?.pushups || 0);
    const [pullups, setPullups] = useState<number>(data?.pullups || 0);
    const [runMeters, setRunMeters] = useState<number>(data?.run_meters || 0);
    const [bikeMeters, setBikeMeters] = useState<number>(
      data?.bike_meters || 0
    );
    const [smoke, setSmoke] = useState<boolean>(data?.smoke || false);
    const [edibles, setEdibles] = useState<boolean>(data?.edibles || false);
    const [alcohol, setAlcohol] = useState<boolean>(data?.alcohol || false);
    const [pornography, setPornography] = useState<boolean>(
      data?.pornography || false
    );
    const [youtube, setYoutube] = useState<boolean>(data?.youtube || false);
    const [pagesRead, setPagesRead] = useState<number>(data?.pages_read || 0);

    const [stretchNotes, setStretchNotes] = useState<string>(
      data?.stretch_notes || ""
    );
    const [cardioNotes, setCardioNotes] = useState<string>(
      data?.cardio_notes || ""
    );
    const [strengthNotes, setStrengthNotes] = useState<string>(
      data?.strength_notes || ""
    );

    useImperativeHandle(
      ref,
      () => ({
        getTableData: () => ({
          pushups,
          pullups,
          run_meters: runMeters,
          bike_meters: bikeMeters,
          stretch_notes: stretchNotes,
          cardio_notes: cardioNotes,
          strength_notes: strengthNotes,
          smoke,
          edibles,
          alcohol,
          pornography,
          youtube,
          pages_read: pagesRead,
        }),
      }),
      [
        pushups,
        pullups,
        runMeters,
        bikeMeters,
        stretchNotes,
        cardioNotes,
        strengthNotes,
        smoke,
        edibles,
        alcohol,
        pornography,
        youtube,
        pagesRead,
      ]
    );

    return (
      <section className="pt-8">
        <h2 className="text-xl font-semibold mb-4">Today&apos;s Stats</h2>
        <div className="space-y-2 items-end">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pushups</TableHead>
                <TableHead>Pullups</TableHead>
                <TableHead>Running (m)</TableHead>
                <TableHead>Biking (m)</TableHead>
                <TableHead>Smoke</TableHead>
                <TableHead>Edibles</TableHead>
                <TableHead>Alcohol</TableHead>
                <TableHead>Porn</TableHead>
                <TableHead>YouTube</TableHead>
                <TableHead>Pages Read</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {session ? (
                <TableRow>
                  <TableCell>
                    <Input
                      className="w-16"
                      type="number"
                      value={pushups}
                      onChange={(e) => setPushups(parseInt(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="w-16"
                      type="number"
                      value={pullups}
                      onChange={(e) => setPullups(parseInt(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="w-24"
                      type="number"
                      value={runMeters}
                      onChange={(e) => setRunMeters(parseInt(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="w-24"
                      type="number"
                      value={bikeMeters}
                      onChange={(e) => setBikeMeters(parseInt(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={smoke}
                      onCheckedChange={(e) => setSmoke(e as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={edibles}
                      onCheckedChange={(e) => setEdibles(e as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={alcohol}
                      onCheckedChange={(e) => setAlcohol(e as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={pornography}
                      onCheckedChange={(e) => setPornography(e as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={youtube}
                      onCheckedChange={(e) => setYoutube(e as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="w-16"
                      type="number"
                      value={pagesRead}
                      onChange={(e) => setPagesRead(parseInt(e.target.value))}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell>{pushups || 0}</TableCell>
                  <TableCell>{pullups || 0}</TableCell>
                  <TableCell>{runMeters || 0}</TableCell>
                  <TableCell>{bikeMeters || 0}</TableCell>
                  <TableCell>{getBooleanLogo(smoke)}</TableCell>
                  <TableCell>{getBooleanLogo(edibles)}</TableCell>
                  <TableCell>{getBooleanLogo(alcohol)}</TableCell>
                  <TableCell>{getBooleanLogo(pornography)}</TableCell>
                  <TableCell>{getBooleanLogo(youtube)}</TableCell>
                  <TableCell>{pagesRead || 0}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Strength</TableHead>
                <TableHead>Cardio</TableHead>
                <TableHead>Stretch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {session ? (
                <TableRow>
                  <TableCell className="w-1/3">
                    <Input
                      className="w-full"
                      value={strengthNotes}
                      onChange={(e) => setStrengthNotes(e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="w-1/3">
                    <Input
                      className="w-full"
                      value={cardioNotes}
                      onChange={(e) => setCardioNotes(e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="w-1/3">
                    <Input
                      className="w-full"
                      value={stretchNotes}
                      onChange={(e) => setStretchNotes(e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell className="w-1/3">
                    {strengthNotes || "Nothing yet"}
                  </TableCell>
                  <TableCell className="w-1/3">
                    {cardioNotes || "Nothing yet"}
                  </TableCell>
                  <TableCell className="w-1/3">
                    {stretchNotes || "Nothing yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    );
  }
);

export default DailyMetrics;

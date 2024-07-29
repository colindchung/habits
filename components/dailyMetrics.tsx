import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSessionContext } from "@/contexts/SessionContext";
import { Check, Pencil, PenIcon, X } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "./ui/button";

interface DailyMetricsProps {
  data?: {
    pushups: number;
    pullups: number;
    run_meters: number;
    bike_meters: number;
    stretch_html: string;
    cardio_html: string;
    strength_html: string;
    smoke: boolean;
    alcohol: boolean;
    edibles: boolean;
    pornography: boolean;
    youtube: boolean;
    pages_read: number;
  };
}

function getBooleanLogo(value: boolean) {
  return value ? (
    <Check className="text-red-500" />
  ) : (
    <X className="text-green-500" />
  );
}

function ReadOnlyTable({ data }: DailyMetricsProps) {
  return data ? (
    <div className="space-y-8">
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
          <TableRow>
            <TableCell>{data.pushups || 0}</TableCell>
            <TableCell>{data.pullups || 0}</TableCell>
            <TableCell>{data.run_meters || 0}</TableCell>
            <TableCell>{data.bike_meters || 0}</TableCell>
            <TableCell>{getBooleanLogo(data.smoke)}</TableCell>
            <TableCell>{getBooleanLogo(data.edibles)}</TableCell>
            <TableCell>{getBooleanLogo(data.alcohol)}</TableCell>
            <TableCell>{getBooleanLogo(data.pornography)}</TableCell>
            <TableCell>{getBooleanLogo(data.youtube)}</TableCell>
            <TableCell>{data.pages_read || 0}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* TODO: Render HTML */}
      {/* <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Strength</TableHead>
            <TableHead>Cardio</TableHead>
            <TableHead>Stretch</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{data.stretch_html}</TableCell>
            <TableCell>{data.strength_html}</TableCell>
            <TableCell>{data.strength_html}</TableCell>
          </TableRow>
        </TableBody>
      </Table> */}
    </div>
  ) : (
    <p className="text-xs italic">No data for today</p>
  );
}

function WriteTable({ data }: DailyMetricsProps) {
  const [pushups, setPushups] = useState<number>(data?.pushups || 0);
  const [pullups, setPullups] = useState<number>(data?.pullups || 0);
  const [runMeters, setRunMeters] = useState<number>(data?.run_meters || 0);
  const [bikeMeters, setBikeMeters] = useState<number>(data?.bike_meters || 0);
  const [smoke, setSmoke] = useState<boolean>(data?.smoke || false);
  const [edibles, setEdibles] = useState<boolean>(data?.edibles || false);
  const [alcohol, setAlcohol] = useState<boolean>(data?.alcohol || false);
  const [pornography, setPornography] = useState<boolean>(
    data?.pornography || false
  );
  const [youtube, setYoutube] = useState<boolean>(data?.youtube || false);
  const [pagesRead, setPagesRead] = useState<number>(data?.pages_read || 0);

  const handleSave = () => {
    console.log("TODO: Save");
  };

  return (
    <div className="space-y-8 items-end">
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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
                className="w-16"
                type="number"
                value={runMeters}
                onChange={(e) => setRunMeters(parseInt(e.target.value))}
              />
            </TableCell>
            <TableCell>
              <Input
                className="w-16"
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
            <TableCell>
              {/* TODO: Add functionality and tooltip */}
              <PenIcon
                className="w-4 text-slate-500 hover:text-slate-700"
                onClick={handleSave}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function DailyMetrics({ data }: DailyMetricsProps) {
  const session = useSessionContext();

  return (
    <section className="pt-8">
      <h2 className="text-xl font-semibold">Today</h2>

      {session ? <WriteTable data={data} /> : <ReadOnlyTable data={data} />}
    </section>
  );
}

export default DailyMetrics;

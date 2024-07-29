import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";

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

function DailyMetrics({ data }: DailyMetricsProps) {
  return (
    <section className="pt-8">
      <h2 className="text-xl font-semibold">Today&apos;s Data</h2>
      {data ? (
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
      )}
    </section>
  );
}

export default DailyMetrics;

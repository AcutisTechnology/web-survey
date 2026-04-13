import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Star, Calendar, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import InteractiveMap from "@/components/map/InteractiveMap";

const MapaInterativo = () => {
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<number | null>(null);
  const [hoveredNeighborhoodId, setHoveredNeighborhoodId] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<{ name: string } | null>(null);
  // New: load external SVG and enable interactions
  const [svgHtml, setSvgHtml] = useState<string>("");
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<{ id: string; population: number; leaders: number; events: number; influencers: number } | null>(null);

  // Dados fictícios por microregião
  const REGION_FAKE_DATA: Record<string, { population: number; leaders: number; events: number; influencers: number }> = {};
  const getRegionData = (id: string) => {
    const cached = REGION_FAKE_DATA[id];
    if (cached) return cached;
    let seed = 0;
    for (let i = 0; i < id.length; i++) {
      seed += id.charCodeAt(i) * (i + 1);
    }
    const range = (min: number, max: number, mult: number) =>
      Math.floor(min + (Math.abs(Math.sin(seed * mult)) * (max - min)));
    const data = {
      population: range(50000, 250000, 0.0031),
      leaders: range(5, 80, 0.007),
      events: range(1, 150, 0.005),
      influencers: range(3, 60, 0.009),
    };
    REGION_FAKE_DATA[id] = data;
    return data;
  };
  const formatNumber = (n: number) => n.toLocaleString("pt-BR");

  useEffect(() => {
    // Fetch SVG from public folder as text and inject inline
    const loadSvg = async () => {
      try {
        const res = await fetch("/PB_Microregions.svg");
        const text = await res.text();
        setSvgHtml(text);
      } catch (e) {
        console.error("Erro ao carregar SVG:", e);
      }
    };
    loadSvg();
  }, []);

  useEffect(() => {
    // After SVG is injected, bind events to paths for interactivity
    if (!svgContainerRef.current) return;
    const root = svgContainerRef.current;
    const paths = root.querySelectorAll<SVGPathElement>("path");
    const handleEnter = (ev: Event) => {
      const el = ev.currentTarget as SVGPathElement;
      el.style.opacity = "0.9";
      el.style.cursor = "pointer";
    };
    const handleLeave = (ev: Event) => {
      const el = ev.currentTarget as SVGPathElement;
      el.style.opacity = "1";
    };
    const handleClick = (ev: Event) => {
      const el = ev.currentTarget as SVGPathElement;
      const id = el.getAttribute("id") || "Região";
      const info = getRegionData(id);
      setSelectedRegion({ id, ...info });
    };
    paths.forEach((p) => {
      p.addEventListener("mouseenter", handleEnter);
      p.addEventListener("mouseleave", handleLeave);
      p.addEventListener("click", handleClick);
    });
    return () => {
      paths.forEach((p) => {
        p.removeEventListener("mouseenter", handleEnter);
        p.removeEventListener("mouseleave", handleLeave);
        p.removeEventListener("click", handleClick);
      });
    };
  }, [svgHtml]);

  // Geometria do mapa circular
  const cx = 400; // centro X
  const cy = 225; // centro Y
  const R = 180; // raio

  // Utilitários para construir setores radiais sem espaços
  const degToRad = (deg: number) => (deg * Math.PI) / 180;
  const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => ({
    x: cx + r * Math.cos(degToRad(deg)),
    y: cy + r * Math.sin(degToRad(deg)),
  });
  const makeSectorPath = (cx: number, cy: number, r: number, startDeg: number, endDeg: number) => {
    const start = polarToCartesian(cx, cy, r, startDeg);
    const end = polarToCartesian(cx, cy, r, endDeg);
    const largeArcFlag = endDeg - startDeg <= 180 ? 0 : 1;
    // Move ao centro, linha ao ponto inicial no círculo, arco até o ponto final, e volta ao centro
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
  };
  const createNeighborhood = (
    id: number,
    name: string,
    startDeg: number,
    endDeg: number,
    fill: string,
    activeFill: string
  ) => {
    const mid = (startDeg + endDeg) / 2;
    const label = polarToCartesian(cx, cy, R * 0.62, mid);
    return {
      id,
      name,
      d: makeSectorPath(cx, cy, R, startDeg, endDeg),
      labelX: label.x,
      labelY: label.y,
      fill,
      activeFill,
      stroke: "none",
    };
  };

  const neighborhoods = [
    createNeighborhood(1, "Jardim das Flores", -30, 15, "#E5F6FF", "#CDEAFE"),
    createNeighborhood(2, "Vila Nova", 15, 60, "#F1F5F9", "#E2E8F0"),
    createNeighborhood(3, "Alto da Serra", 60, 110, "#FEF3C7", "#FDE68A"),
    createNeighborhood(4, "Lago Azul", 110, 160, "#FCE7F3", "#FBCFE8"),
    createNeighborhood(5, "Centro", 160, 210, "#DCFCE7", "#BBF7D0"),
    createNeighborhood(6, "Bairro Industrial", 210, 255, "#FFE4E6", "#FECDD3"),
    createNeighborhood(7, "Parque Verde", 255, 300, "#EDE9FE", "#DDD6FE"),
    createNeighborhood(8, "Santa Clara", 300, 330, "#D1FAE5", "#A7F3D0"),
    createNeighborhood(9, "Boa Vista", 330, 350, "#E0E7FF", "#C7D2FE"),
    createNeighborhood(10, "Nova Esperança", 350, 390, "#FDE2E4", "#FACBD3"),
  ];

  const locations = [
    { id: 1, city: "São Paulo", lat: 23.5505, lng: -46.6333, type: "lideranca", count: 45, neighborhoodId: 5 },
    { id: 2, city: "Rio de Janeiro", lat: 22.9068, lng: -43.1729, type: "evento", count: 12, neighborhoodId: 6 },
    { id: 3, city: "Belo Horizonte", lat: 19.9167, lng: -43.9345, type: "influenciador", count: 8, neighborhoodId: 1 },
    { id: 4, city: "Curitiba", lat: 25.4284, lng: -49.2733, type: "evento", count: 5, neighborhoodId: 7 },
    { id: 5, city: "Porto Alegre", lat: 30.0346, lng: -51.2177, type: "lideranca", count: 20, neighborhoodId: 10 },
    { id: 6, city: "Recife", lat: 8.0476, lng: -34.877, type: "influenciador", count: 13, neighborhoodId: 4 },
    { id: 7, city: "Salvador", lat: 12.9718, lng: -38.5011, type: "evento", count: 9, neighborhoodId: 8 },
    { id: 8, city: "Fortaleza", lat: 3.7172, lng: -38.5434, type: "lideranca", count: 18, neighborhoodId: 3 },
    { id: 9, city: "Manaus", lat: -3.119, lng: -60.0217, type: "influenciador", count: 7, neighborhoodId: 9 },
    { id: 10, city: "Campinas", lat: -22.9099, lng: -47.0626, type: "evento", count: 6, neighborhoodId: 2 },
  ];

  // Contorno geral da cidade (círculo perfeito definido no SVG)

  const selectedNeighborhood = selectedNeighborhoodId ? neighborhoods.find((n) => n.id === selectedNeighborhoodId) || null : null;
  const filteredLocations = locations
    .filter((l) => (selectedNeighborhoodId ? l.neighborhoodId === selectedNeighborhoodId : true))
    .filter((l) => {
      if (selectedFilter === "todos") return true;
      if (selectedFilter === "liderancas") return l.type === "lideranca";
      if (selectedFilter === "eventos") return l.type === "evento";
      if (selectedFilter === "influenciadores") return l.type === "influenciador";
      return true;
    });

  const selectedNeighborhoodCount = locations
    .filter((l) => (selectedNeighborhoodId ? l.neighborhoodId === selectedNeighborhoodId : true))
    .reduce((sum, l) => sum + l.count, 0);

  const leadersCount = locations
    .filter((l) => (selectedNeighborhoodId ? l.neighborhoodId === selectedNeighborhoodId : true))
    .filter((l) => l.type === "lideranca")
    .reduce((sum, l) => sum + l.count, 0);

  const eventsCount = locations
    .filter((l) => (selectedNeighborhoodId ? l.neighborhoodId === selectedNeighborhoodId : true))
    .filter((l) => l.type === "evento")
    .reduce((sum, l) => sum + l.count, 0);

  const influencersCount = locations
    .filter((l) => (selectedNeighborhoodId ? l.neighborhoodId === selectedNeighborhoodId : true))
    .filter((l) => l.type === "influenciador")
    .reduce((sum, l) => sum + l.count, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mapa Interativo</h1>
          <p className="text-muted-foreground mt-2">Visualização territorial da campanha</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card shadow-lg h-[480px] lg:h-[520px]">
            <CardContent className="p-6 h-full">
              <div className="w-full h-full bg-muted rounded-lg p-2 relative overflow-hidden [&_svg]:w-full [&_svg]:h-full">
                <div
                  ref={svgContainerRef}
                  className="w-full h-full rounded-md [&_path]:cursor-pointer"
                  dangerouslySetInnerHTML={{ __html: svgHtml }}
                />

                {selectedRegion && (
                  <div className="absolute left-4 bottom-4 bg-background/80 backdrop-blur rounded-lg border border-border p-3 shadow-md">
                    <p className="text-sm text-muted-foreground">Microregião selecionada</p>
                    <p className="font-semibold">{selectedRegion.id}</p>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <Badge variant="secondary">População: {formatNumber(selectedRegion.population)}</Badge>
                      <Badge variant="outline">Lideranças: {selectedRegion.leaders}</Badge>
                      <Badge variant="outline">Eventos: {selectedRegion.events}</Badge>
                      <Badge variant="outline">Influenciadores: {selectedRegion.influencers}</Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-gradient-card shadow-md">
            <CardHeader>
                <CardTitle className="text-lg">
                  {selectedRegion ? `Microregião: ${selectedRegion.id}` : (selectedCity ? selectedCity.name : 'Cidades Cadastradas')}
                </CardTitle>
              </CardHeader>
            <CardContent className="space-y-3">
              {filteredLocations.map((location) => (
                <div
                  key={location.id}
                  className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedCity({ name: location.city })}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{location.city}</p>
                      <p className="text-sm text-muted-foreground">{location.count} registros</p>
                    </div>
                    <Badge variant="secondary">{location.type}</Badge>
                  </div>
                </div>
              ))}
              {filteredLocations.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum registro para os filtros selecionados.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapaInterativo;

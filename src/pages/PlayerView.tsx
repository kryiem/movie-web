import { useEffect, useMemo } from "react";

import { MWStreamType } from "@/backend/helpers/streams";
import { BrandPill } from "@/components/layout/BrandPill";
import { Player } from "@/components/player";
import { AutoPlayStart } from "@/components/player/atoms";
import { usePlayer } from "@/components/player/hooks/usePlayer";
import { useShouldShowControls } from "@/components/player/hooks/useShouldShowControls";
import { ScrapingPart } from "@/pages/parts/player/ScrapingPart";
import {
  PlayerMeta,
  metaToScrapeMedia,
  playerStatus,
} from "@/stores/player/slices/source";

export function PlayerView() {
  const { status, setScrapeStatus, playMedia, setMeta } = usePlayer();
  const desktopControlsVisible = useShouldShowControls();
  const meta = useMemo<PlayerMeta>(
    () => ({
      type: "show",
      title: "House",
      tmdbId: "1408",
      releaseYear: 2004,
      episode: {
        number: 1,
        title: "Pilot",
        tmdbId: "63738",
      },
      season: {
        number: 1,
        tmdbId: "3674",
        title: "Season 1",
      },
    }),
    []
  );

  useEffect(() => {
    setMeta(meta);
  }, [setMeta, meta]);
  const scrapeMedia = useMemo(() => metaToScrapeMedia(meta), [meta]);

  return (
    <Player.Container onLoad={setScrapeStatus}>
      {status === playerStatus.SCRAPING ? (
        <ScrapingPart
          media={scrapeMedia}
          onGetStream={(out) => {
            if (out?.stream.type !== "file") return;
            const qualities = Object.keys(
              out.stream.qualities
            ) as (keyof typeof out.stream.qualities)[];
            const file = out.stream.qualities[qualities[0]];
            if (!file) return;
            playMedia({
              type: MWStreamType.MP4,
              url: file.url,
            });
          }}
        />
      ) : null}

      <Player.BlackOverlay show={desktopControlsVisible} />

      <Player.CenterControls>
        <Player.LoadingSpinner />
        <AutoPlayStart />
      </Player.CenterControls>

      <Player.TopControls show={desktopControlsVisible}>
        <div className="grid grid-cols-[1fr,auto] xl:grid-cols-3 items-center">
          <div className="flex space-x-3 items-center">
            <Player.BackLink />
            <span className="text mx-3 text-type-secondary">/</span>
            <Player.Title />
            <Player.BookmarkButton />
          </div>
          <div className="text-center hidden xl:flex justify-center items-center">
            <Player.EpisodeTitle />
          </div>
          <div className="flex items-center justify-end">
            <BrandPill />
          </div>
        </div>
      </Player.TopControls>

      <Player.BottomControls show={desktopControlsVisible}>
        <Player.ProgressBar />
        <div className="flex justify-between">
          <Player.LeftSideControls>
            <Player.Pause />
            <Player.SkipBackward />
            <Player.SkipForward />
            <Player.Volume />
            <Player.Time />
          </Player.LeftSideControls>
          <div>
            <Player.Fullscreen />
          </div>
        </div>
      </Player.BottomControls>
    </Player.Container>
  );
}

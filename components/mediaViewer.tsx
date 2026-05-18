"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ImageIcon,
  Play,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MediaItem {
  type: "image" | "video";
  url: string;
}

interface MediaViewerProps {
  images?: string[];
  videos?: string[];
  onDelete?: (index: number, type: "image" | "video") => void;
  showDelete?: boolean;
  hideHeader?: boolean;
  view?: "grid" | "carousel";
}

const STYLES = {
  headerText:
    "flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-mono text-sm select-none",
  gridContainer: "grid grid-cols-3 gap-2 w-full",
  carouselContainer:
    "flex gap-2 overflow-x-auto pb-2 snap-x pt-2 p-2 w-full [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-400/20 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700/30 [&::-webkit-scrollbar-track]:bg-transparent",
  cardWrapper: "relative group z-10 w-full",
  carouselItemWrapper: "relative group shrink-0 w-24 h-24 snap-start",
  triggerBtn:
    "group relative aspect-video w-full h-full rounded-sm overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 transition-all duration-300 cursor-pointer",
  videoBox:
    "flex flex-col items-center justify-center h-full gap-2 bg-gradient-to-br from-purple-500/5 to-purple-500/10",
  videoIconWrapper:
    "p-3 bg-purple-500/10 dark:bg-purple-400/10 rounded-full group-hover:bg-purple-500/20 dark:group-hover:bg-purple-400/20 group-hover:scale-110 transition-all duration-300",
  videoIcon:
    "text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400",
  btnDelete:
    "absolute -top-2 -right-2 z-20 w-8 h-8 text-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform opacity-60",
  dialogContent:
    "fixed inset-0 !left-0 !top-0 !translate-x-0 !translate-y-0 !max-w-none w-full h-full !rounded-none p-0 border-none bg-white/98 dark:bg-black/98 flex flex-col font-mono z-50",
  topBar:
    "flex-shrink-0 flex items-center justify-between p-4 z-50 absolute top-0 left-0 right-0 w-full flex-row",
  badgeCounter:
    "flex items-center gap-2 bg-white/90 dark:bg-zinc-950/60 backdrop-blur-xl rounded-sm px-4 py-2 border-2 border-purple-600 dark:border-purple-400 text-zinc-800 dark:text-zinc-200 font-bold text-sm select-none shadow-[0_0_10px_rgba(168,85,247,0.15)]",
  controlsGroup: "flex gap-2 items-center",
  zoomPanel:
    "flex items-center gap-2 bg-white/90 dark:bg-zinc-950/60 border-2 border-purple-600 dark:border-purple-400 backdrop-blur-xl rounded-sm p-1 shadow-[0_0_10px_rgba(168,85,247,0.15)]",
  zoomBtn:
    "h-9 w-9 rounded-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 transition-colors flex items-center justify-center",
  zoomValue:
    "text-zinc-800 dark:text-zinc-200 text-xs font-bold px-2 whitespace-nowrap select-none",
  btnBack:
    "h-10 px-4 rounded-sm bg-white/90 dark:bg-zinc-950/60 hover:bg-zinc-100 dark:hover:bg-zinc-900 backdrop-blur-xl border-2 border-purple-600 dark:border-purple-400 text-zinc-800 dark:text-zinc-200 text-sm font-bold active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(168,85,247,0.15)]",
  viewport:
    "flex-1 w-full h-full flex items-center justify-center relative px-4 overflow-hidden bg-zinc-50 dark:bg-zinc-950/40 z-10",
  interactiveStage:
    "touch-none select-none transition-transform w-full h-full flex items-center justify-center",
  navBtn:
    "absolute top-1/2 -translate-y-1/2 h-12 w-12 rounded-sm bg-white/90 hover:bg-zinc-100 dark:bg-zinc-950/60 dark:hover:bg-zinc-900 text-purple-600 dark:text-purple-400 backdrop-blur-sm border-2 border-purple-600 dark:border-purple-400 active:scale-95 transition-transform disabled:opacity-0 flex items-center justify-center z-20 shadow-[0_0_10px_rgba(168,85,247,0.15)]",
  bottomBar:
    "flex-shrink-0 w-full px-4 pb-6 pt-3 bg-gradient-to-t from-zinc-100 dark:from-black via-zinc-50/50 dark:via-black/20 to-transparent absolute bottom-0 left-0 right-0 z-50",
  thumbBtn:
    "relative aspect-square w-full rounded-sm overflow-hidden transition-all duration-200 bg-zinc-900",
};

export function MediaViewer({
  images = [],
  videos = [],
  onDelete,
  showDelete = false,
  hideHeader = false,
  view = "grid",
}: MediaViewerProps) {
  const t = useTranslations("MediaViewer");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [thumbCarouselApi, setThumbCarouselApi] = useState<CarouselApi>();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef({ initialDistance: 0, initialZoom: 1 });

  const allMedia: MediaItem[] = useMemo(
    () => [
      ...images.map((url) => ({ type: "image" as const, url })),
      ...videos.map((url) => ({ type: "video" as const, url })),
    ],
    [images, videos],
  );

  const totalMedia = allMedia.length;

  const resetZoomAndPosition = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const goNext = () => {
    if (currentIndex < totalMedia - 1) {
      setCurrentIndex(currentIndex + 1);
      resetZoomAndPosition();
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetZoomAndPosition();
    }
  };

  const closeViewer = () => {
    setViewerOpen(false);
    resetZoomAndPosition();
  };

  useEffect(() => {
    if (!viewerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      } else if (e.key === "Escape") {
        closeViewer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerOpen, currentIndex, totalMedia]);

  useEffect(() => {
    if (thumbCarouselApi && viewerOpen) {
      thumbCarouselApi.scrollTo(currentIndex);
    }
  }, [currentIndex, thumbCarouselApi, viewerOpen]);

  useEffect(() => {
    if (!viewerOpen || allMedia[currentIndex]?.type !== "image") return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        pinchRef.current.initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY,
        );
        pinchRef.current.initialZoom = zoom;
        setIsPinching(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && isPinching) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY,
        );
        const scale = currentDistance / pinchRef.current.initialDistance;
        const newZoom = Math.min(
          Math.max(pinchRef.current.initialZoom * scale, 1),
          3,
        );
        setZoom(newZoom);

        if (newZoom === 1) {
          setPosition({ x: 0, y: 0 });
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        setIsPinching(false);
      }
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [viewerOpen, currentIndex, allMedia, zoom, isPinching]);

  if (totalMedia === 0) return null;

  const openViewer = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(index);
    resetZoomAndPosition();
    setViewerOpen(true);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.5, 3));
  const handleZoomOut = () => {
    setZoom((z) => {
      const newZoom = Math.max(z - 0.5, 1);
      if (newZoom === 1) setPosition({ x: 0, y: 0 });
      return newZoom;
    });
  };

  const handleDelete = (index: number) => {
    if (!onDelete) return;
    const imageCount = images.length;
    if (index < imageCount) {
      onDelete(index, "image");
    } else {
      onDelete(index - imageCount, "video");
    }

    if (totalMedia === 1) {
      closeViewer();
    } else if (currentIndex >= totalMedia - 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
      resetZoomAndPosition();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    } else if (zoom === 1 && e.touches.length === 1) {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoom > 1 && e.touches.length === 1) {
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (zoom === 1 && e.touches.length === 1) {
      setTouchEnd({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  };

  const handleTouchEndDrag = () => {
    if (zoom === 1 && !isPinching) {
      const diffX = touchStart.x - touchEnd.x;
      const diffY = Math.abs(touchStart.y - touchEnd.y);

      if (Math.abs(diffX) > 50 && diffY < 100) {
        if (diffX > 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    }
    setIsDragging(false);
  };

  const currentMedia = allMedia[currentIndex];

  return (
    <>
      <div className="space-y-3 w-full" onClick={(e) => e.stopPropagation()}>
        {!hideHeader && (
          <div className="flex items-center justify-between w-full">
            <div className={STYLES.headerText}>
              <ImageIcon size={16} />
              <p>{t("header_title")}</p>
            </div>
          </div>
        )}

        <div
          className={
            view === "grid" ? STYLES.gridContainer : STYLES.carouselContainer
          }>
          {allMedia.map((media, idx) => (
            <div
              key={idx}
              className={
                view === "carousel"
                  ? STYLES.carouselItemWrapper
                  : STYLES.cardWrapper
              }>
              <Button
                type="button"
                variant="ghost"
                onClick={(e) => openViewer(idx, e)}
                className={STYLES.triggerBtn}>
                {media.type === "image" ? (
                  <Image
                    src={media.url}
                    alt={`Index: ${idx}`}
                    fill
                    className="object-contain"
                    loading="lazy"
                    sizes="(max-width: 768px) 33vw, 200px"
                  />
                ) : (
                  <div className={STYLES.videoBox}>
                    <div className={STYLES.videoIconWrapper}>
                      <Play
                        className={cn(
                          STYLES.videoIcon,
                          view === "carousel" ? "h-4 w-4" : "h-6 w-6",
                        )}
                      />
                    </div>
                    {view === "grid" && (
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono uppercase">
                        {t("type_video")}
                      </span>
                    )}
                  </div>
                )}
              </Button>

              {showDelete && onDelete && (
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(idx);
                  }}
                  className={STYLES.btnDelete}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent
          className={STYLES.dialogContent}
          onClick={(e) => e.stopPropagation()}
          onInteractOutside={(e) => e.preventDefault()}>
          <DialogTitle className="sr-only">
            Media viewport index {currentIndex + 1}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Full screen media element preview layer
          </DialogDescription>

          <div className={STYLES.topBar}>
            <div className={STYLES.badgeCounter}>
              <span>
                {currentIndex + 1} / {totalMedia}
              </span>
            </div>

            <div className={STYLES.controlsGroup}>
              {currentMedia?.type === "image" && (
                <div className={STYLES.zoomPanel}>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomOut();
                    }}
                    disabled={zoom <= 1}
                    className={STYLES.zoomBtn}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>

                  <span className={STYLES.zoomValue}>
                    {Math.round(zoom * 100)}%
                  </span>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomIn();
                    }}
                    disabled={zoom >= 3}
                    className={STYLES.zoomBtn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Button
                size="lg"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  closeViewer();
                }}
                className={STYLES.btnBack}>
                <ChevronLeft className="h-5 w-5" /> {t("btn_back")}
              </Button>
            </div>
          </div>

          <div className={STYLES.viewport}>
            {currentMedia?.type === "image" ? (
              <div
                ref={imageRef}
                className={STYLES.interactiveStage}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEndDrag}>
                <div
                  style={{
                    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                    cursor:
                      zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                    transition:
                      isDragging || isPinching
                        ? "none"
                        : "transform 0.3s ease-out",
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}>
                  <Image
                    src={currentMedia.url}
                    alt="Expanded stage node"
                    fill
                    className="object-contain"
                    draggable={false}
                    priority
                  />
                </div>
              </div>
            ) : (
              <video
                src={currentMedia?.url}
                controls
                autoPlay
                className="max-w-[100vw] max-h-screen w-auto h-auto rounded-sm relative z-10"
                key={`video-${currentIndex}`}
              />
            )}

            {totalMedia > 1 && zoom === 1 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  disabled={currentIndex === 0}
                  className={cn(STYLES.navBtn, "left-4")}>
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  disabled={currentIndex === totalMedia - 1}
                  className={cn(STYLES.navBtn, "right-4")}>
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
          </div>

          {totalMedia > 1 && (
            <div className={STYLES.bottomBar}>
              <Carousel
                setApi={setThumbCarouselApi}
                className="w-full max-w-5xl mx-auto"
                opts={{
                  loop: false,
                  align: "center",
                  containScroll: "keepSnaps",
                }}>
                <CarouselContent className="-ml-3">
                  {allMedia.map((media, idx) => (
                    <CarouselItem
                      key={idx}
                      className="pl-3 basis-1/5 sm:basis-1/6 md:basis-1/8">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(idx);
                          resetZoomAndPosition();
                        }}
                        className={cn(
                          STYLES.thumbBtn,
                          idx === currentIndex
                            ? "border-2 border-purple-500 dark:border-purple-400 scale-105"
                            : "border border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100",
                        )}>
                        {media.type === "image" ? (
                          <Image
                            src={media.url}
                            alt="Node thumbnail"
                            fill
                            className="object-cover"
                            sizes="120px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                            <Play className="h-5 w-5 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400" />
                          </div>
                        )}
                      </Button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

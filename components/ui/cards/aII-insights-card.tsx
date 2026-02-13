"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Loader2,
  Lightbulb,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SalesTrends {
  summary: string;
  highlights: string[];
  trend: "up" | "down" | "stable";
}

interface Inventory {
  summary: string;
  alerts: string[];
  recommendations: string[];
}

interface ActionItems {
  urgent: string[];
  recommended: string[];
  opportunities: string[];
}

interface Insights {
  salesTrends: SalesTrends;
  inventory: Inventory;
  actionItems: ActionItems;
}

interface RawMetrics {
  currentRevenue: number;
  previousRevenue: number;
  revenueChange: string;
  orderCount: number;
  avgOrderValue: string;
  unfulfilledCount: number;
  lowStockCount: number;
}

interface InsightsResponse {
  success: boolean;
  insights: Insights;
  rawMetrics: RawMetrics;
  generatedAt: string;
  error?: string;
}

function AIInsightsCardSkeleton() {
  return (
    <div className="rounded-xl border border-foreground/10 p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-background to-primary">
          <Sparkles className="h-5 w-5 text-background" />
        </div>
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-1 h-4 w-48" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-16 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") {
    return <TrendingUp className="h-4 w-4 text-emerald-600" />;
  }
  if (trend === "down") {
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  }
  return <Minus className="h-4 w-4 text-foreground/40" />;
}

export function AIInsightsCard() {
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const hasFetched = useRef(false);

  const fetchInsights = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch("/api/studio/store/insights");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch insights");
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load insights");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Prevent double fetch in React StrictMode
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchInsights();
  }, [fetchInsights]);

  if (loading) {
    return <AIInsightsCardSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-600/20 bg-red-600/5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/10">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-600/80">
                Failed to load insights
              </h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchInsights()}
            className="border-red-600/20 text-red-600 hover:bg-red-600/10"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data?.insights) {
    return null;
  }

  const { insights, rawMetrics, generatedAt } = data;

  return (
    <div className="rounded-xl border border-foreground/10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-foreground/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-background to-primary">
            <Sparkles className="h-5 w-5 text-background" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              Insights
            </h2>
            <p className="text-sm text-foreground/40">
              Updated{" "}
              {new Date(generatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchInsights(true)}
          disabled={refreshing}
          className="gap-2"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 gap-px border-b border-foreground/10 sm:grid-cols-4">
        <div className="p-4">
          <p className="text-xs font-medium text-foreground/40">
            Revenue (7d)
          </p>
          <p className="mt-1 text-lg font-bold text-foreground">
            £
            {Number(rawMetrics.currentRevenue).toLocaleString("en-GB", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p
            className={cn(
              "text-xs",
              Number(rawMetrics.revenueChange) > 0
                ? "text-emerald-600"
                : Number(rawMetrics.revenueChange) < 0
                  ? "text-red-600"
                  : "text-foreground/40",
            )}
          >
            {Number(rawMetrics.revenueChange) > 0 ? "+" : ""}
            {rawMetrics.revenueChange}% vs last week
          </p>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-foreground/40">
            Orders (7d)
          </p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {rawMetrics.orderCount}
          </p>
          <p className="text-xs text-foreground/40">This week</p>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-foreground/40">
            Avg Order
          </p>
          <p className="mt-1 text-lg font-bold text-foreground">
            £{rawMetrics.avgOrderValue}
          </p>
          <p className="text-xs text-foreground/40">Per order</p>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-foreground/40">
            Pending
          </p>
          <p
            className={cn(
              "mt-1 text-lg font-bold",
              rawMetrics.unfulfilledCount > 0
                ? "text-amber-600"
                : "text-emerald-600",
            )}
          >
            {rawMetrics.unfulfilledCount}
          </p>
          <p className="text-xs text-foreground/40">To ship</p>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid gap-6 p-6 md:grid-cols-3">
        {/* Sales Trends */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendIcon trend={insights.salesTrends.trend} />
            <h3 className="font-medium text-foreground">
              Sales Trends
            </h3>
          </div>
          <p className="text-sm text-foreground/60">
            {insights.salesTrends.summary}
          </p>
          <ul className="space-y-2">
            {insights.salesTrends.highlights.map((highlight, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-foreground/60"
              >
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Inventory */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-foreground">
              Inventory
            </h3>
          </div>
          <p className="text-sm text-foreground/60">
            {insights.inventory.summary}
          </p>
          {insights.inventory.alerts.length > 0 && (
            <div className="space-y-2">
              {insights.inventory.alerts.map((alert, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-amber-600/10 p-2 text-sm text-amber-600"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          )}
          <ul className="space-y-2">
            {insights.inventory.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-foreground/60"
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Items */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-foreground">
              Action Items
            </h3>
          </div>

          {insights.actionItems.urgent.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-red-600">
                Urgent
              </p>
              {insights.actionItems.urgent.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-red-600/10 p-2 text-sm text-red-600/80"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {insights.actionItems.recommended.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">
                Recommended
              </p>
              <ul className="space-y-1">
                {insights.actionItems.recommended.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-foreground/60"
                  >
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insights.actionItems.opportunities.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                Opportunities
              </p>
              <ul className="space-y-1">
                {insights.actionItems.opportunities.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-foreground/60"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

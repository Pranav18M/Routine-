'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/layout/Header';
import PageWrapper from '../../../components/layout/PageWrapper';
import WeeklyInsightCard from '../../../components/insights/WeeklyInsightCard';
import HabitCompletionChart from '../../../components/insights/HabitCompletionChart';
import PatternGrid from '../../../components/insights/PatternGrid';
import Button from '../../../components/ui/Button';
import { InsightSkeleton } from '../../../components/ui/LoadingSkeleton';
import { useInsights } from '../../../hooks/useInsights';
import { cn } from '../../../lib/utils';

export default function InsightsPage() {
  const { weeklyInsights, chartData, loading, generating, fetchWeeklyInsights, fetchChartData, generateInsight } = useInsights();
  const [chartDays, setChartDays] = useState(14);

  useEffect(() => {
    fetchWeeklyInsights();
    fetchChartData(14);
  }, []);

  const handleChartRange = (days) => {
    setChartDays(days);
    fetchChartData(days);
  };

  return (
    <>
      <Header
        title="Insights"
        subtitle="Your patterns and progress"
        rightAction={
          <Button
            size="sm"
            variant="secondary"
            onClick={generateInsight}
            loading={generating}
          >
            Generate
          </Button>
        }
      />

      <PageWrapper>
        {loading ? (
          <InsightSkeleton />
        ) : (
          <div className="space-y-5 stagger-children">
            {/* Latest insight */}
            {weeklyInsights.length > 0 ? (
              <WeeklyInsightCard insight={weeklyInsights[0]} />
            ) : (
              <div className="solid-card p-6 text-center">
                <p className="text-3xl mb-3">📊</p>
                <p className="text-[15px] font-semibold text-primary">No insights yet</p>
                <p className="text-[13px] text-secondary mt-1 mb-4">
                  Log habits for at least a week, then generate your first insight.
                </p>
                <Button onClick={generateInsight} loading={generating}>
                  Generate weekly insight
                </Button>
              </div>
            )}

            {/* Completion chart */}
            <div className="solid-card p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[15px] font-semibold text-primary">Daily completion</p>
                <div className="flex gap-1">
                  {[7, 14, 30].map(d => (
                    <button
                      key={d}
                      onClick={() => handleChartRange(d)}
                      className={cn(
                        'px-2.5 py-1 rounded-[8px] text-[11px] font-semibold transition-all',
                        chartDays === d
                          ? 'bg-[#6C47FF] text-white'
                          : 'bg-[var(--color-elevated)] text-secondary',
                      )}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
              <HabitCompletionChart data={chartData.dailyData} />
            </div>

            {/* Per-habit breakdown */}
            {chartData.habitData?.length > 0 && (
              <div className="solid-card p-4">
                <p className="text-[15px] font-semibold text-primary mb-3">Habit breakdown</p>
                <PatternGrid habitData={chartData.habitData} />
              </div>
            )}

            {/* Past weekly insights */}
            {weeklyInsights.length > 1 && (
              <div>
                <p className="text-[13px] font-semibold text-secondary uppercase tracking-wider mb-3">Previous weeks</p>
                <div className="space-y-3">
                  {weeklyInsights.slice(1).map(insight => (
                    <WeeklyInsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </PageWrapper>
    </>
  );
}
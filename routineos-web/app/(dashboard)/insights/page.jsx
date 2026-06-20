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

export default function InsightsPage() {
  const { weeklyInsights, chartData, loading, generating, fetchWeeklyInsights, fetchChartData, generateInsight } = useInsights();
  const [chartDays, setChartDays] = useState(14);

  useEffect(() => { fetchWeeklyInsights(); fetchChartData(14); }, []);

  const handleChartRange = (days) => { setChartDays(days); fetchChartData(days); };

  return (
    <>
      <Header
        title="Insights"
        subtitle="Your patterns and progress"
        rightAction={<Button size="sm" variant="secondary" onClick={generateInsight} loading={generating}>Generate</Button>}
      />

      <PageWrapper>
        {loading ? <InsightSkeleton /> : (
          <div className="stagger" style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {weeklyInsights.length > 0 ? (
              <WeeklyInsightCard insight={weeklyInsights[0]} />
            ) : (
              <div className="card card-pad" style={{ textAlign:'center' }}>
                <p style={{ fontSize:30, marginBottom:12 }}>📊</p>
                <p style={{ fontSize:15, fontWeight:600, color:'#F4F4F8', margin:0 }}>No insights yet</p>
                <p style={{ fontSize:13, color:'#9B9BB4', margin:'4px 0 16px' }}>Log habits for at least a week, then generate your first insight.</p>
                <Button onClick={generateInsight} loading={generating}>Generate weekly insight</Button>
              </div>
            )}

            <div className="card card-pad">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <p style={{ fontSize:15, fontWeight:600, color:'#F4F4F8', margin:0 }}>Daily completion</p>
                <div style={{ display:'flex', gap:4 }}>
                  {[7,14,30].map(d => (
                    <button key={d} onClick={() => handleChartRange(d)} style={{
                      padding:'5px 10px', borderRadius:8, fontSize:11, fontWeight:600, border:'none', cursor:'pointer',
                      background: chartDays === d ? '#6C47FF' : '#252540', color: chartDays === d ? '#fff' : '#9B9BB4',
                    }}>{d}d</button>
                  ))}
                </div>
              </div>
              <HabitCompletionChart data={chartData.dailyData} />
            </div>

            {chartData.habitData?.length > 0 && (
              <div className="card card-pad">
                <p style={{ fontSize:15, fontWeight:600, color:'#F4F4F8', marginBottom:12 }}>Habit breakdown</p>
                <PatternGrid habitData={chartData.habitData} />
              </div>
            )}

            {weeklyInsights.length > 1 && (
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:'#9B9BB4', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>Previous weeks</p>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {weeklyInsights.slice(1).map(insight => <WeeklyInsightCard key={insight.id} insight={insight} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </PageWrapper>
    </>
  );
}

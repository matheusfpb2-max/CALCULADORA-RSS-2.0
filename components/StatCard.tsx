import React from 'react'

type Props = {
  title: string
  value: number
  color?: string
}

export default function StatCard({ title, value, color = '' }: Props) {
  const formatNumber = (num: number) => new Intl.NumberFormat('pt-BR').format(num || 0)

  return (
    <div className="bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800 shadow-2xl">
      <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-400 mb-3">{title}</h2>

      <p className={`text-3xl font-black ${color}`}>{formatNumber(value)}</p>
    </div>
  )
}

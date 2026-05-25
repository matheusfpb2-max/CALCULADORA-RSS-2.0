import React from 'react'
import type { Farm } from '../types'

type Props = {
  farms: Farm[]
  taxTable: Record<number, number>
  updateFarm: (i: number, field: keyof Farm | 'name', value: string | number) => void
  removeFarm: (i: number) => void
}

export default function FarmTable({ farms, taxTable, updateFarm, removeFarm }: Props) {
  const calculateNet = (rss: number, level: number) => {
    const tax = taxTable[level] || 0
    return rss * (1 - tax / 100)
  }

  const formatNumber = (num: number) => new Intl.NumberFormat('pt-BR').format(num || 0)

  return (
    <div className="bg-zinc-900/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-zinc-800/80 text-left uppercase tracking-wider text-sm">
            <tr>
              <th className="p-4">Farm</th>
              <th className="p-4">Comida</th>
              <th className="p-4">Madeira</th>
              <th className="p-4">Pedra</th>
              <th className="p-4">Ouro</th>
              <th className="p-4">Nível</th>
              <th className="p-4">Imposto</th>
              <th className="p-4">Líquido</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>

          <tbody>
            {farms.map((farm, index) => {
              const totalFarm = Number(farm.food || 0) + Number(farm.wood || 0) + Number(farm.stone || 0) + Number(farm.gold || 0)
              const tax = taxTable[farm.level] || 0
              const net = calculateNet(totalFarm, farm.level)

              return (
                <tr key={index} className="border-t border-zinc-800 hover:bg-zinc-800/40">
                  <td className="p-4">
                    <input value={farm.name} onChange={(e) => updateFarm(index, 'name', e.target.value)} className="bg-black/40 border border-zinc-700 rounded-xl px-3 py-2 w-full" />
                  </td>

                  {(['food', 'wood', 'stone', 'gold'] as (keyof Farm)[]).map((resource) => (
                    <td className="p-4" key={resource}>
                      <input type="number" value={farm[resource]} onChange={(e) => updateFarm(index, resource, e.target.value)} className="bg-black/40 border border-zinc-700 rounded-xl px-3 py-2 w-full" />
                    </td>
                  ))}

                  <td className="p-4">
                    <input type="number" min={1} max={10} value={farm.level} onChange={(e) => updateFarm(index, 'level', e.target.value)} className="bg-black/40 border border-zinc-700 rounded-xl px-3 py-2 w-full" />
                  </td>

                  <td className="p-4 text-red-400 font-bold">{tax}%</td>

                  <td className="p-4 text-green-400 font-bold">{formatNumber(Math.floor(net))}</td>

                  <td className="p-4">
                    <button onClick={() => removeFarm(index)} className="bg-red-500/20 border border-red-500/30 hover:bg-red-500/40 transition px-4 py-2 rounded-xl">Remover</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

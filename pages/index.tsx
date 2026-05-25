import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { auth, db } from '../lib/firebase'
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  User,
} from 'firebase/auth'

import { doc, setDoc, getDoc } from 'firebase/firestore'
import type { NextPage } from 'next'
import StatCard from '../components/StatCard'
import FarmTable from '../components/FarmTable'

type Farm = {
  name: string
  food: number
  wood: number
  stone: number
  gold: number
  level: number
}

const taxTable: Record<number, number> = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 5,
  6: 7,
  7: 10,
  8: 12,
  9: 15,
  10: 18,
}

const defaultFarms: Farm[] = [
  {
    name: 'Farm 1',
    food: 50000000,
    wood: 30000000,
    stone: 15000000,
    gold: 5000000,
    level: 8,
  },
]

const Home: NextPage = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const [farms, setFarms] = useState<Farm[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('rok-farms') : null
      return raw ? JSON.parse(raw) : defaultFarms
    } catch (e) {
      return defaultFarms
    }
  })

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser && db) {
        try {
          const ref = doc(db, 'rok-users', currentUser.uid)
          const snapshot = await getDoc(ref)

          if (snapshot.exists()) {
            const data = snapshot.data()
            if (data && Array.isArray(data.farms)) {
              setFarms(data.farms as Farm[])
            }
          }
        } catch (error) {
          console.error(error)
        }
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('rok-farms', JSON.stringify(farms))
      }
    } catch (e) {
      console.error(e)
    }

    const saveData = async () => {
      if (!user || !db) return

      try {
        await setDoc(doc(db, 'rok-users', user.uid), {
          farms,
          updatedAt: Date.now(),
          email: user.email,
        })
      } catch (error) {
        console.error(error)
      }
    }

    saveData()
  }, [farms, user])

  const calculateNet = (rss: number, level: number) => {
    const tax = taxTable[level] || 0
    return rss * (1 - tax / 100)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num || 0)
  }

  const totalFood = farms.reduce((acc, farm) => acc + Number(farm.food || 0), 0)
  const totalWood = farms.reduce((acc, farm) => acc + Number(farm.wood || 0), 0)
  const totalStone = farms.reduce((acc, farm) => acc + Number(farm.stone || 0), 0)
  const totalGold = farms.reduce((acc, farm) => acc + Number(farm.gold || 0), 0)

  const totalGross = totalFood + totalWood + totalStone + totalGold

  const totalNet = farms.reduce((acc, farm) => {
    return (
      acc +
      calculateNet(farm.food || 0, farm.level) +
      calculateNet(farm.wood || 0, farm.level) +
      calculateNet(farm.stone || 0, farm.level) +
      calculateNet(farm.gold || 0, farm.level)
    )
  }, 0)

  const updateFarm = (index: number, field: string, value: string | number) => {
    setFarms((prev) => {
      const updated = [...prev]
      const isNumber = ['food', 'wood', 'stone', 'gold', 'level'].includes(field)
      updated[index] = {
        ...updated[index],
        // @ts-ignore dynamic field assignment
        [field]: isNumber ? Number(value) : value,
      }
      return updated
    })
  }

  const addFarm = () => {
    setFarms([
      ...farms,
      {
        name: `Farm ${farms.length + 1}`,
        food: 0,
        wood: 0,
        stone: 0,
        gold: 0,
        level: 1,
      },
    ])
  }

  const removeFarm = (index: number) => {
    setFarms(farms.filter((_, i) => i !== index))
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      if (!auth) return
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error(error)
    }
  }

  const logout = async () => {
    try {
      if (!auth) return
      await signOut(auth)
    } catch (error) {
      console.error(error)
    }
  }

  

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Carregando sistema...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#22c55e,_transparent_35%),radial-gradient(circle_at_bottom_left,_#3b82f6,_transparent_30%)]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">ROK RSS Dashboard</h1>

            <p className="text-zinc-400 mt-2 text-lg">Gerenciador profissional de farms do Rise of Kingdoms.</p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {user ? (
              <div className="flex items-center gap-3 bg-zinc-900/70 border border-zinc-800 px-5 py-3 rounded-2xl backdrop-blur-xl shadow-2xl">
                <img src={user.photoURL || ''} alt="avatar" className="w-10 h-10 rounded-full" />

                <div>
                  <p className="font-bold text-sm">{user.displayName}</p>
                  <p className="text-xs text-zinc-400">{user.email}</p>
                </div>

                <button onClick={logout} className="bg-red-500/20 border border-red-500/30 hover:bg-red-500/40 transition px-4 py-2 rounded-xl">Sair</button>
              </div>
            ) : (
              <button onClick={loginWithGoogle} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-all duration-300 px-6 py-3 rounded-2xl font-bold shadow-2xl">Login com Google</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-6 mb-8">
          <StatCard title="Total Bruto" value={totalGross} color="text-white" />
          <StatCard title="Total Líquido" value={Math.floor(totalNet)} color="text-green-400" />
          <StatCard title="Comida" value={totalFood} color="text-orange-400" />
          <StatCard title="Madeira" value={totalWood} color="text-amber-500" />
          <StatCard title="Pedra" value={totalStone} color="text-slate-300" />
          <StatCard title="Ouro" value={totalGold} color="text-yellow-400" />
          <StatCard title="Farms" value={farms.length} color="text-blue-400" />
        </div>

        <FarmTable farms={farms} taxTable={taxTable} updateFarm={updateFarm} removeFarm={removeFarm} />

        <div className="mt-6 flex justify-end">
          <button onClick={addFarm} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-all duration-300 px-6 py-3 rounded-2xl font-bold shadow-2xl">+ Adicionar Farm</button>
        </div>
      </motion.div>
    </div>
  )
}

export default Home

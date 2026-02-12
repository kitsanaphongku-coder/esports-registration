'use client'

import { useState } from 'react'

type Game = 'ROV' | 'Freefire' | 'SF6' | 'Tekken' | 'eFootball'

interface Player {
  name: string
  role?: string
}

interface TeamData {
  game: Game
  teamName: string
  players: Player[]
  reserves: Player[]
  manager?: string
  teamLeader?: string
  coach?: string
}

export default function Home() {
  const [game, setGame] = useState<Game>('ROV')
  const [teamName, setTeamName] = useState('')
  const [players, setPlayers] = useState<Player[]>([
    { name: '', role: '' },
    { name: '', role: '' },
    { name: '', role: '' },
    { name: '', role: '' },
    { name: '', role: '' },
  ])
  const [reserves, setReserves] = useState<Player[]>([
    { name: '', role: '' },
    { name: '', role: '' },
  ])
  const [manager, setManager] = useState('')
  const [teamLeader, setTeamLeader] = useState('')
  const [coach, setCoach] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [registrations, setRegistrations] = useState<TeamData[]>([])

  const gameConfig = {
    ROV: { mainPlayers: 5, reserves: 2, requiresRole: false },
    Freefire: { mainPlayers: 4, reserves: 2, requiresRole: false },
    SF6: { mainPlayers: 1, reserves: 0, requiresRole: false },
    Tekken: { mainPlayers: 1, reserves: 0, requiresRole: false },
    eFootball: { mainPlayers: 1, reserves: 0, requiresRole: false },
  }

  const config = gameConfig[game]

  const handleGameChange = (newGame: Game) => {
    setGame(newGame)
    const newConfig = gameConfig[newGame]
    
    // Reset players
    setPlayers(
      Array(newConfig.mainPlayers).fill(null).map(() => ({ name: '', role: '' }))
    )
    
    // Reset reserves
    setReserves(
      Array(newConfig.reserves).fill(null).map(() => ({ name: '', role: '' }))
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    const allPlayersFilled = players.every(p => p.name.trim() !== '')
    
    if (!teamName.trim()) {
      alert('กรุณากรอกชื่อทีม')
      return
    }
    
    if (!allPlayersFilled) {
      alert(`กรุณากรอกชื่อนักกีฬาครบ ${config.mainPlayers} คน`)
      return
    }

    if (game === 'ROV') {
      if (!manager?.trim()) {
        alert('กรุณากรอกชื่อผู้จัดการทีม')
        return
      }
      if (!teamLeader?.trim()) {
        alert('กรุณากรอกชื่อหัวหน้าทีม')
        return
      }
      if (!coach?.trim()) {
        alert('กรุณากรอกชื่อโค้ช')
        return
      }
    }

    const teamData: TeamData = {
      game,
      teamName,
      players: players.filter(p => p.name.trim() !== ''),
      reserves: reserves.filter(p => p.name.trim() !== ''),
      manager: manager || undefined,
      teamLeader: teamLeader || undefined,
      coach: coach || undefined,
    }

    setRegistrations([...registrations, teamData])
    setSubmitted(true)

    // Reset form
    setTimeout(() => {
      setTeamName('')
      setPlayers(
        Array(config.mainPlayers).fill(null).map(() => ({ name: '', role: '' }))
      )
      setReserves(
        Array(config.reserves).fill(null).map(() => ({ name: '', role: '' }))
      )
      setManager('')
      setTeamLeader('')
      setCoach('')
      setSubmitted(false)
    }, 2000)
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          🎮 ระบบลงทะเบียนทีมอีสปอร์ต
        </h1>

        {submitted && (
          <div className="mb-6 p-4 bg-green-500 text-white rounded-lg text-center animate-pulse">
            ✅ ลงทะเบียนสำเร็จ!
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          {/* Game Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-3 text-lg">
              🎯 เลือกเกม
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(Object.keys(gameConfig) as Game[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGameChange(g)}
                  className={`p-3 rounded-lg font-semibold transition-all ${
                    game === g
                      ? 'bg-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Team Name */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
              👥 ชื่อทีม <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="กรอกชื่อทีม"
              required
            />
          </div>

          {/* Main Players */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-3 text-lg">
              ⚔️ นักกีฬาหลัก ({config.mainPlayers} คน) <span className="text-red-500">*</span>
            </label>
            {players.map((player, index) => (
              <div key={index} className="mb-3">
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => {
                    const newPlayers = [...players]
                    newPlayers[index].name = e.target.value
                    setPlayers(newPlayers)
                  }}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder={`นักกีฬาคนที่ ${index + 1}`}
                  required
                />
              </div>
            ))}
          </div>

          {/* Reserve Players */}
          {config.reserves > 0 && (
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-3 text-lg">
                🔄 นักกีฬาสำรอง ({config.reserves} คน) (ไม่บังคับ)
              </label>
              {reserves.map((player, index) => (
                <div key={index} className="mb-3">
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => {
                      const newReserves = [...reserves]
                      newReserves[index].name = e.target.value
                      setReserves(newReserves)
                    }}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder={`นักกีฬาสำรองคนที่ ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ROV Specific Fields */}
          {game === 'ROV' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  📋 ผู้จัดการทีม <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="กรอกชื่อผู้จัดการทีม"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  👑 หัวหน้าทีม <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={teamLeader}
                  onChange={(e) => setTeamLeader(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="กรอกชื่อหัวหน้าทีม"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">
                  🎓 โค้ช <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={coach}
                  onChange={(e) => setCoach(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="กรอกชื่อโค้ช"
                  required
                />
              </div>
            </>
          )}

          {/* Other Games Optional Fields */}
          {game !== 'ROV' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  📋 ผู้จัดการทีม (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="กรอกชื่อผู้จัดการทีม"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  👑 หัวหน้าทีม (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  value={teamLeader}
                  onChange={(e) => setTeamLeader(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="กรอกชื่อหัวหน้าทีม"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">
                  🎓 โค้ช (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  value={coach}
                  onChange={(e) => setCoach(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="กรอกชื่อโค้ช"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🚀 ลงทะเบียนทีม
          </button>
        </form>

        {/* Registrations List */}
        {registrations.length > 0 && (
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              📊 รายการทีมที่ลงทะเบียนแล้ว ({registrations.length} ทีม)
            </h2>
            <div className="space-y-4">
              {registrations.map((team, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-purple-600">{team.teamName}</h3>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {team.game}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="font-semibold text-gray-700 mb-1">นักกีฬาหลัก:</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {team.players.map((p, i) => (
                        <li key={i}>{p.name}</li>
                      ))}
                    </ul>
                  </div>

                  {team.reserves.length > 0 && (
                    <div className="mb-3">
                      <p className="font-semibold text-gray-700 mb-1">นักกีฬาสำรอง:</p>
                      <ul className="list-disc list-inside text-gray-600">
                        {team.reserves.map((p, i) => (
                          <li key={i}>{p.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {team.manager && (
                    <p className="text-gray-600">
                      <span className="font-semibold">ผู้จัดการทีม:</span> {team.manager}
                    </p>
                  )}
                  {team.teamLeader && (
                    <p className="text-gray-600">
                      <span className="font-semibold">หัวหน้าทีม:</span> {team.teamLeader}
                    </p>
                  )}
                  {team.coach && (
                    <p className="text-gray-600">
                      <span className="font-semibold">โค้ช:</span> {team.coach}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

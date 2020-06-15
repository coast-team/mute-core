import test from 'ava'
import { TextInsert, TextOperation } from 'mute-structs'
import { Subject } from 'rxjs'

import { MuteCoreFactory, MuteCoreTypes, StateStrategy, Strategy } from '../src/index.node'

const avatar = 'https://www.shareicon.net/data/256x256/2015/11/26/184857_dice_256x256.png'

function generateMuteCore(strategy: Strategy, name: string): MuteCoreTypes {
  const state = StateStrategy.emptyState(strategy)
  if (!state) {
    throw new Error('state is null')
  }

  return MuteCoreFactory.createMuteCore({
    strategy,
    profile: {
      displayName: name,
      login: 'bot.random',
      avatar,
    },
    docContent: state,
    metaTitle: {
      title: 'Untitled Document',
      titleModified: 0,
    },
    metaFixData: {
      docCreated: Date.now(),
      cryptoKey: '',
    },
    metaLogs: {
      share: false,
      vector: new Map<number, number>(),
    },
    metaPulsar: {
      activatePulsar: false,
    },
  })
}

test('experimentLogs-local-rename-op', (t) => {
  const muteCore = generateMuteCore(Strategy.RENAMABLELOGOOTSPLIT, 'toto')
  const localOps$ = new Subject<TextOperation[]>()

  muteCore.localTextOperations$ = localOps$.asObservable()

  for (let i = 0; i < 5; i++) {
    const insertOp = new TextInsert(0, 'A', muteCore.myMuteCoreId)
    localOps$.next([insertOp])
  }

  muteCore.experimentLogs$.subscribe(() => {
    t.pass()
  })

  localOps$.next([]) // Trigger a rename operation
})

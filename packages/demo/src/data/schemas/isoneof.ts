export const SampleSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
    },
    g1a: {
      type: 'string',
      title: '组1a',
      isOneOf: true,
      isOneOfInclusiveGroup: 'g1',
    },
    g1b: {
      type: 'string',
      title: '组1b',
      isOneOf: true,
      isOneOfInclusiveGroup: 'g1',
    },
    g1c: {
      type: 'string',
      title: '组1c',
      isOneOf: true,
      isOneOfInclusiveGroup: 'g1',
    },
    g2a: {
      type: 'string',
      title: '组2a',
      isOneOf: true,
      isOneOfInclusiveGroup: 'g2',
    },
    g2b: {
      type: 'string',
      title: '组2b',
      isOneOf: true,
      isOneOfInclusiveGroup: 'g2',
    },
    c: {
      type: 'string',
      title: '单独c',
      isOneOf: true,
    },
    d: {
      type: 'string',
      title: '单独d',
      isOneOf: true,
      isOneOfExclusiveGroup: 'g3',
    },
    e: {
      type: 'string',
      title: '单独e',
      isOneOf: true,
      isOneOfExclusiveGroup: 'g3',
    },
  },
}

export const SampleData = {}

export const SamplePasted = {
  g1a: 'g1a-val',
}

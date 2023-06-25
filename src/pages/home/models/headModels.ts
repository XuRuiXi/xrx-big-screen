export interface headModelsProps {
  screenType: 'city' | 'command';
}

export default {
  namespace: 'headModels',
  state: {
    screenType: 'city',
  },

  /* 更新状态（通用） */
  reducers: {
    update: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
};

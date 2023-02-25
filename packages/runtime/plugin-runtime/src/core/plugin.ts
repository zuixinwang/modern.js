import type React from 'react';
import {
  Setup,
  ToThreads,
  CommonAPI,
  PluginOptions,
  createManager,
  createPipeline,
  createAsyncPipeline,
} from '@modern-js/plugin';
import type { RuntimeContext, TRuntimeContext } from '../runtimeContext';
import { createLoaderManager } from './loader/loaderManager';

const hoc = createPipeline<
  {
    App: React.ComponentType<any>;
  },
  React.ComponentType<any>
>();

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppProps {}

const provide = createPipeline<
  {
    element: JSX.Element;
    readonly props: AppProps;
    readonly context: RuntimeContext;
  },
  JSX.Element
>();

const client = createAsyncPipeline<
  {
    App: React.ComponentType<any>;
    readonly context: RuntimeContext;
    ModernRender: (App: React.ReactElement) => void;
    ModernHydrate: (App: React.ReactElement, callback?: () => void) => void;
  },
  void
>();

const server = createAsyncPipeline<
  {
    App: React.ComponentType<any>;
    readonly context: RuntimeContext;
  },
  string
>();

const init = createAsyncPipeline<
  {
    context: RuntimeContext;
  },
  unknown
>();

const pickContext = createPipeline<
  { context: RuntimeContext; pickedContext: TRuntimeContext },
  TRuntimeContext
>();

const runtimeHooks = {
  hoc,
  provide,
  client,
  server,
  init,
  pickContext,
};

/** All hooks of runtime plugin. */
export type RuntimeHooks = typeof runtimeHooks;

/** All hook callbacks of runtime plugin. */
export type RuntimeHookCallbacks = ToThreads<RuntimeHooks>;

/** All apis for runtime plugin. */
export type PluginAPI = CommonAPI<RuntimeHooks>;

/** Plugin options of a runtime plugin. */
export type Plugin = PluginOptions<RuntimeHooks, Setup<RuntimeHooks>>;

export const createRuntime = () => createManager(runtimeHooks);

/**
 * register init hook. It would be revoked both ssr and csr.
 */
const registerInit = (
  App: React.ComponentType,
  _init: (context: RuntimeContext) => any | Promise<any>,
) => {
  const originalInit = (App as any).init;
  (App as any).init = async (context: RuntimeContext) => {
    if (!context.loaderManager) {
      context.loaderManager = createLoaderManager({});
    }

    await Promise.all([originalInit?.(context), _init?.(context)]);
  };
};

export const runtime = createRuntime();

export const { createPlugin } = runtime;

export { registerInit };

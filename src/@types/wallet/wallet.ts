export type WalletContextProps = {
    accessToken: string | undefined,
    axiosHeaders: {},
    account: string | '',
    accountShot: string | '',
    connected: boolean | false,
    type: string | '',
    requestKey: string | '',
    message: string | '',

    connectMetamask: VoidFunction,

    disconnect: VoidFunction,
    cancelRequest: VoidFunction,
    // themeMode: ThemeMode;
    // themeDirection: ThemeDirection;
    // themeColorPresets: ThemeColorPresets;
    // setColor: {
    //     name: string;
    //     primary: ColorVariants;
    //     secondary: ColorVariants;
    // };
    // colorOption: {
    //     name: string;
    //     primary: string;
    //     secondary: string;
    // }[];
    // onChangeColorPresets: (event: React.ChangeEvent<HTMLInputElement>) => void;
    // onToggleMode: VoidFunction;
    // onToggleDirection: VoidFunction;
    // onResetSetting: VoidFunction;
};

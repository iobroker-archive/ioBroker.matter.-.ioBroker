import { type DeviceStateObject, PropertyType, ValueType } from './DeviceStateObject';
import { GenericDevice, type DetectedDevice, type DeviceOptions, StateAccessType } from './GenericDevice';

export class Motion extends GenericDevice {
    #getMotionState?: DeviceStateObject<boolean>;
    #getBrightnessState?: DeviceStateObject<number>;

    constructor(detectedDevice: DetectedDevice, adapter: ioBroker.Adapter, options?: DeviceOptions) {
        super(detectedDevice, adapter, options);

        this._construction.push(
            this.addDeviceStates([
                {
                    name: 'ACTUAL',
                    valueType: ValueType.Boolean,
                    accessType: StateAccessType.Read,
                    type: PropertyType.Motion,
                    callback: state => (this.#getMotionState = state),
                },
                {
                    name: 'SECOND',
                    valueType: ValueType.NumberPercent,
                    accessType: StateAccessType.Read,
                    type: PropertyType.Brightness,
                    callback: state => (this.#getBrightnessState = state),
                },
            ]),
        );
    }

    getMotion(): boolean | undefined {
        if (!this.#getMotionState) {
            throw new Error('Value state not found');
        }
        return this.#getMotionState.value;
    }

    updateMotion(value: boolean): Promise<void> {
        if (!this.#getMotionState) {
            throw new Error('Value state not found');
        }
        return this.#getMotionState.updateValue(value);
    }

    hasBrightness(): boolean {
        return !!this.#getBrightnessState;
    }

    getBrightness(): number | undefined {
        if (!this.#getBrightnessState) {
            throw new Error('Brightness state not found');
        }
        return this.#getBrightnessState.value;
    }

    updateBrightness(value: number): Promise<void> {
        if (!this.#getBrightnessState) {
            throw new Error('Brightness state not found');
        }
        return this.#getBrightnessState.updateValue(value);
    }
}

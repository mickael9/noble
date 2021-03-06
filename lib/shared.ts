export type CharacteristicPropertyNames =
  | 'broadcast'
  | 'read'
  | 'writeWithoutResponse'
  | 'write'
  | 'notify'
  | 'indicate'
  | 'authenticatedSignedWrites'
  | 'extendedProperties';

export interface GattCharacteristic {
  startHandle: number;
  endHandle: number;
  valueHandle: number;
  properties: CharacteristicPropertyNames[];
  propertiesRaw?: number;
  uuid: string;
}

export const propertyBitstoPropertyNames = (propertyBits: number): CharacteristicPropertyNames[] => {
  const propertyNames: CharacteristicPropertyNames[] = [];

  if (propertyBits & 0x01) {
    propertyNames.push('broadcast');
  }
  if (propertyBits & 0x02) {
    propertyNames.push('read');
  }
  if (propertyBits & 0x04) {
    propertyNames.push('writeWithoutResponse');
  }
  if (propertyBits & 0x08) {
    propertyNames.push('write');
  }
  if (propertyBits & 0x10) {
    propertyNames.push('notify');
  }
  if (propertyBits & 0x20) {
    propertyNames.push('indicate');
  }
  if (propertyBits & 0x40) {
    propertyNames.push('authenticatedSignedWrites');
  }
  if (propertyBits & 0x80) {
    propertyNames.push('extendedProperties');
  }

  return propertyNames;
};

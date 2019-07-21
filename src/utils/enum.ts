export function arrayFromEnum(Enum: any): number[] {
	const anyEnum = <any>Enum;
	const keys = Object.keys(anyEnum);
	const res = keys.filter(k => !isNaN(Number(k))).map(a => Number(a));
	return <any>res;
}

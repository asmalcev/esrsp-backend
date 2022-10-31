import { WithId } from "src/common-types";

export class IdSet {

	private arr: Array<WithId> = [];

	constructor(arr: Array<WithId> = []) {
		arr.forEach(elem => this.add(elem));
	}

	add(value: WithId): IdSet {
		const includes = this.arr.find(elem => elem.id === value.id);

		if (!includes) this.arr.push(value);

		return this;
	}

	toArray(): Array<WithId> {
		return this.arr.slice();
	}
}
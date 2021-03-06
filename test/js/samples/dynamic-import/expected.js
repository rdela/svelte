import {
	SvelteComponent,
	destroy_component,
	init,
	mount_component,
	noop,
	safe_not_equal,
	transition_in,
	transition_out
} from "svelte/internal";

import LazyLoad from "./LazyLoad.svelte";

function create_fragment(ctx) {
	let current;
	const lazyload = new LazyLoad({ props: { load: func } });

	return {
		c() {
			lazyload.$$.fragment.c();
		},
		m(target, anchor) {
			mount_component(lazyload, target, anchor);
			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;
			transition_in(lazyload.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(lazyload.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(lazyload, detaching);
		}
	};
}

const func = () => import("./Foo.svelte");

class Component extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment, safe_not_equal, {});
	}
}

export default Component;
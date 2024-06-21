import { ControlEvent, StatusChangeEvent } from "@angular/forms"
import { Observable, filter, map, shareReplay, startWith } from "rxjs"

export function controlStatus(initial = 0) {
  return (source: Observable<ControlEvent<unknown>>) => {
    return source.pipe(
      filter((e) => e instanceof StatusChangeEvent),
      map((e) => e.source.status === 'VALID' ? 1 : 0),
      startWith(initial),
      shareReplay(1)
    )
  }
}

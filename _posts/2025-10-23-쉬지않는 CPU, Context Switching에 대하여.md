---
layout: post
title: 쉬지않는 CPU, Context Switching에 대하여
date: 2025-10-23 14:25:00
description:
tags: 
categories: 크래프톤 정글
---

## CPU가 불쌍해 보여요
CS를 공부하다보니 CPU에게 일을 시키게 하기 위해 많은 기술이 들어가는걸 알게 되었다. 정말 쉬지않게 만들기 위해 다양한 방법을 사용한다는 것을 알았다. 이러한 모습이 노예보다 못한 것 같아 불쌍하다는 생각도 들었다. 오늘은 CPU를 굴리는 방법 중 하나인 Context Switching에 대해 알아보려고 한다.

## Context Switching이란?
**Context switching**이란 하나의 프로세스가 CPU를 사용 중인 상태에서 다른 프로세스가 CPU를 사용하도록 하기 위해, 이전에 프로세스의 상태(Context)를 보관하고 새로운 프로세스의 상태를 적재하는 작업을 말한다.

Context에는 프로세스를 실행 하기 위한 실행 상태 정보가 담겨있다. 커널은 context swithc를 위해 CPU의 상태 정보를 PCB(Process Control Block)에 담는다.

(Ubuntu 24.04.3 LTS) 기준
pahole을 사용하여 현재 구현된 Linux PCB 구현체를 확인할 수 있다. 아래는 linux에서 사용하는 PCB에 구현체 task_struct의 일부 모습이다.

```c
struct task_struct {
    struct thread_info         thread_info;          /*     0    24 */
    unsigned int               __state;              /*    24     4 */
    unsigned int               saved_state;          /*    28     4 */
    void *                     stack;                /*    32     8 */
    refcount_t                 usage;                /*    40     4 */
    unsigned int               flags;                /*    44     4 */
    unsigned int               ptrace;               /*    48     4 */
    int                        on_cpu;               /*    52     4 */
    struct __call_single_node  wake_entry;           /*    56    16 */
    /* --- cacheline 1 boundary (64 bytes) was 8 bytes ago --- */
    unsigned int               wakee_flips;          /*    72     4 */

    ...중략...    

    /* size: 13888, cachelines: 217, members: 262 */
    /* sum members: 13753, holes: 17, sum holes: 119 */
    /* sum bitfield members: 82 bits, bit holes: 2, sum bit holes: 46 bits */
    /* paddings: 6, sum paddings: 49 */
    /* forced alignments: 2, forced holes: 2, sum forced holes: 64 */
};
```

### 필요성

프로세스의 동시성을 유지하기 위해 꼭 필요한 기법이다.
CPU의 코어는 한번에 하나의 프로세스만 실행할 수 있으므로 여러 프로세스를 빠르게 교체 실행 하여 동시의 동작하는 것처럼 만든다

### 종류

Context switching는 크게 두가지 상황에서 이뤄난다.

- **자발적 스위칭 (Voluntary Context Switch)**: 프로세스가 I/O요청이나 sleep()등으로 스스로 대기상태에 들어가 CPU가 유휴 상태가 발생될 떄
- **강제적 스위칭 (Involuntary Context Switch)**: 스케줄러 정책에 따라 CPU 점유 시간이 끝났거나 더 높은 우선순위의 프로세스가 준비 되었을 때

자발적 스위칭만 존재한다면 하나의 프로세스가 CPU를 점유할 수 있다. 프로세스의 동시성이 깨지는 것이다. 그렇기에 일정한 정책에 따라 강제적 스위칭을 해준다.

### 비용

스위칭은 무거운 작업이다. 단순히 실행 상태를 저장하고 복원하는 오버헤드뿐 아니라 TLB flush를 해야하고 CPU 캐시를 다시 적재해야하기 때문이다.

### 과정

context switching은 단순하게 지금 상태를 PCB에 저장하고 다음 프로세스가 PCB에서 상태를 가져오는 작업이다.
우리는 조금 더 깊히 리눅스 소스 코드를 보며 어떻게 Context switching이 이뤄지는지 알아보자.

리눅스 context_switch()
```c
static __always_inline struct rq *
context_switch(struct rq *rq, struct task_struct *prev,
            struct task_struct *next, struct rq_flags *rf)
{
    prepare_task_switch(rq, prev, next);

    /*
        * For paravirt, this is coupled with an exit in switch_to to
        * combine the page table reload and the switch backend into
        * one hypercall.
        */
    arch_start_context_switch(prev);

    /*
        * kernel -> kernel   lazy + transfer active
        *   user -> kernel   lazy + mmgrab_lazy_tlb() active
        *
        * kernel ->   user   switch + mmdrop_lazy_tlb() active
        *   user ->   user   switch
        *
        * switch_mm_cid() needs to be updated if the barriers provided
        * by context_switch() are modified.
        */
    if (!next->mm) {                                // to kernel
        enter_lazy_tlb(prev->active_mm, next);

        next->active_mm = prev->active_mm;
        if (prev->mm)                           // from user
            mmgrab_lazy_tlb(prev->active_mm);
        else
            prev->active_mm = NULL;
    } else {                                        // to user
        membarrier_switch_mm(rq, prev->active_mm, next->mm);
        /*
            * sys_membarrier() requires an smp_mb() between setting
            * rq->curr / membarrier_switch_mm() and returning to userspace.
            *
            * The below provides this either through switch_mm(), or in
            * case 'prev->active_mm == next->mm' through
            * finish_task_switch()'s mmdrop().
            */
        switch_mm_irqs_off(prev->active_mm, next->mm, next);
        lru_gen_use_mm(next->mm);

        if (!prev->mm) {                        // from kernel
            /* will mmdrop_lazy_tlb() in finish_task_switch(). */
            rq->prev_mm = prev->active_mm;
            prev->active_mm = NULL;
        }
    }

    /* switch_mm_cid() requires the memory barriers above. */
    switch_mm_cid(rq, prev, next);

    prepare_lock_switch(rq, next, rf);

    /* Here we just switch the register state and the stack. */
    switch_to(prev, next, prev);
    barrier();

    return finish_task_switch(prev);
}
```
    

소스 코드를 보면 위와 같은 분기가 나뉘어 진것을 볼 수 있다.

- 커널 스레드 → 유저 스레드
- 커널스레드 → 커널 스레드
- 유저 스레드 → 커널 스레드
- 유저 스레드 → 유저 스레드

이렇게 나뉘는 이유는 커널 스레드가 VM을 가지고 있지 않기 때문이다.  
커널 쓰레드는 VM을 가질 필요가 없어 잠깐 빌려쓴다 그 덕분에 스위칭시 TLB flush를 해야하지만 같은 VM을 바라보는 스레드와 스위칭을 한다면 TLB flush를 안해도 되는 이점을 얻게된다!

커널 내부 처리를 하는 내부 스레드는 담을 정보가 없기 때문에 VM을 지니지 않고 그 전 스레드의 가상주소를 바라보게된다
`next->active_mm = prev->active_mm;` 코드상에서는 해당 부분이 그러한 부분이다.
커널이 참조하는 VM이 사라져도 안되기때문에 커널 스레드 처리를 위해 다양한 분기를 처리한다.



## 참고자료
- [https://ko.wikipedia.org/wiki/문맥_교환](https://ko.wikipedia.org/wiki/%EB%AC%B8%EB%A7%A5_%EA%B5%90%ED%99%98)
- [https://linux-kernel-labs.github.io/refs/heads/master/lectures/processes.html](https://linux-kernel-labs.github.io/refs/heads/master/lectures/processes.html)
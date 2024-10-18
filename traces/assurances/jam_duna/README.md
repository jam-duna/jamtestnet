
This contains a trace for a single `fib` workpackage submitted early in the first epoch, with a guarantee included in block 4 (|E_G|=1) and assurances (|E_A|=5) included in block 5.

Summary

```
[N3]  Blk 0000..0000<-0b55..0251  e'=349462,m'=00, len(γ_a')=0   	[N3] H_t=4193544 H_r=0910..b69d  EpochMarker(η1=151f..3ead) 3:[b=1] 
[N3]  Blk 0b55..0251<-350e..b229  e'=349462,m'=01, len(γ_a')=3   	[N3] H_t=4193545 H_r=27d0..5869   |E_T|=3 3:[b=2|t=3] 
[N2]  Blk 350e..b229<-c02b..c8f9  e'=349462,m'=02, len(γ_a')=6   	[N2] H_t=4193546 H_r=6413..540d   |E_T|=3 2:[b=1|t=3] 3:[b=2|t=3] 
[N1]  Blk c02b..c8f9<-e141..adf1  e'=349462,m'=03, len(γ_a')=9   	[N1] H_t=4193547 H_r=134b..f686   |E_T|=3  |E_G|=1 1:[b=1|t=3|r=1] 2:[b=1|t=3] 3:[b=2|t=3] 
[N4]  Blk e141..adf1<-d210..be02  e'=349462,m'=04, len(γ_a')=12   	[N4] H_t=4193548 H_r=4329..66d0   |E_T|=3  |E_A|=5 1:[b=1|t=3|r=1] 2:[b=1|t=3] 3:[b=2|t=3] 4:[b=1|t=3|a=1] 
[N2]  Blk d210..be02<-dc94..75c2  e'=349462,m'=05, len(γ_a')=12   	[N2] H_t=4193549 H_r=5c46..e964   |E_T|=3 1:[b=1|t=3|r=1] 2:[b=2|t=6|a=1] 3:[b=2|t=3] 4:[b=1|t=3|a=1] 
[N1]  Blk dc94..75c2<-a973..c73f  e'=349462,m'=06, len(γ_a')=12   	[N1] H_t=4193550 H_r=4aaa..94e2   |E_T|=3 1:[b=2|t=6|r=1|a=1] 2:[b=2|t=6|a=1] 3:[b=2|t=3] 4:[b=1|t=3|a=1] 
[N1]  Blk a973..c73f<-f230..55a4  e'=349462,m'=07, len(γ_a')=12   	[N1] H_t=4193551 H_r=9f96..ceb4  1:[b=3|t=6|r=1|a=2] 2:[b=2|t=6|a=1] 3:[b=2|t=3] 4:[b=1|t=3|a=1] 
[N1]  Blk f230..55a4<-65c6..66b7  e'=349462,m'=08, len(γ_a')=12   	[N1] H_t=4193552 H_r=3e82..7b05  1:[b=4|t=6|r=1|a=3] 2:[b=2|t=6|a=1] 3:[b=2|t=3] 4:[b=1|t=3|a=1] 
[N3]  Blk 65c6..66b7<-545c..fc31  e'=349462,m'=09, len(γ_a')=12   	[N3] H_t=4193553 H_r=5838..d51c  1:[b=4|t=6|r=1|a=3] 2:[b=2|t=6|a=1] 3:[b=3|t=3|a=1] 4:[b=1|t=3|a=1] 
[N3]  Blk 545c..fc31<-af68..de27  e'=349462,m'=10, len(γ_a')=12   	[N3] H_t=4193554 H_r=f300..38c6   WinningTickets(12) 1:[b=4|t=6|r=1|a=3] 2:[b=2|t=6|a=1] 3:[b=4|t=3|a=2] 4:[b=1|t=3|a=1] 
[N5]  Blk af68..de27<-d0cd..0a25  e'=349462,m'=11, len(γ_a')=12   	[N5] H_t=4193555 H_r=111d..3ca5  1:[b=4|t=6|r=1|a=3] 2:[b=2|t=6|a=1] 3:[b=4|t=3|a=2] 4:[b=1|t=3|a=1] 5:[b=1|a=1] 
```

A future version of this will have 20 more `fib` and a "Bootstrap" genesis state.


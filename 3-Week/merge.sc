

class BillyClient(val points: Int) 
def points(client: BillyClient) : Int = client.points


enum Color:
  case Blue, Red

class SallyClient(val color: Color)
def tier(client: SallyClient) : Color = client.color


def loyalty(client: BillyClient | SallyClient): (Int, Color) =
  client match
    case b: BillyClient =>
      val p = b.points
      if p > 5 then (p, Color.Red) else (p, Color.Blue)

    case s: SallyClient =>
      val c = s.color
      if c == Color.Blue then (5, c) else (10, c)

val bclient = BillyClient(8)
val sclient = SallyClient(Color.Red)
val l1 = loyalty(bclient)
val l2 = loyalty(sclient)
println(l1)
println(l2)
// Output:
// (8,Red)
// (10,Red)
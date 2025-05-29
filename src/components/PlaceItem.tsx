import styled from 'styled-components'
import Checkbox from '../uikit/Checkbox'
import { Text } from '../uikit/typography'
import type { Place } from '../types'
import ArrowRight from './Icons/arrow-right.svg'

const PlaceItem = ({ place, toggleVisited, navigate }: { place: Place, toggleVisited: (id: string, visited: boolean) => void, navigate: (path: string) => void }) => {
  return (
    <Wrapper style={{ textDecoration: place.visited ? 'line-through' : 'none', marginBottom: '8px' }}>
      <Checkbox checked={place.visited} onChange={() => toggleVisited(place.id, place.visited)} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', cursor: 'pointer' }} onClick={() => navigate(`/place/${place.id}`)}>
        <Text style={{ opacity: place.visited ? 0.3 : 1 }}>{place.name}</Text>
        <img src={ArrowRight} alt="arrow-right" style={{ width: 24, height: 24, marginLeft: 'auto' }} />
      </div>
    </Wrapper>
  )
}

export default PlaceItem

const Wrapper = styled.div`
  display: flex;
  align-items:center;
  gap: 12px
`